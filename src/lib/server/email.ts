import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import nodemailer from 'nodemailer';
import { DATA_DIR } from './db';

/**
 * El correo de Nou Art sale por Barcinet (Mox), no por un relay de terceros.
 * Es infraestructura propia: el dominio está delegado a ns1/ns2.barcinet.com y
 * `nouart.org` es un dominio de correo dado de alta en el Mox de Barcinet, con su
 * propio DKIM. Enviar por un relay externo contradiría el planteamiento soberano
 * de Barcinet, así que no se hace.
 *
 * Puerto 465 con TLS implícito: Mox no escucha en el 587 por diseño.
 */
const HOST = process.env.MAIL_HOST ?? 'mail.barcinet.com';
const PORT = Number(process.env.MAIL_PORT ?? 465);
const USER = process.env.MAIL_USER; // p.ej. no-reply@nouart.org
const PASS = process.env.MAIL_PASS;
const FROM = process.env.MAIL_FROM ?? 'Nou Art <no-reply@nouart.org>';
const OUTBOX = join(DATA_DIR, 'outbox.jsonl');

interface Mail {
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
}

const transport = USER && PASS
	? nodemailer.createTransport({
			host: HOST,
			port: PORT,
			secure: PORT === 465,
			auth: { user: USER, pass: PASS }
		})
	: null;

/** Guarda el mensaje en disco para no perderlo cuando no se puede enviar. */
async function toOutbox(mail: Mail, error?: string) {
	await appendFile(
		OUTBOX,
		JSON.stringify({ ...mail, at: new Date().toISOString(), ...(error ? { error } : {}) }) + '\n'
	);
}

/**
 * Envía por SMTP a través de Barcinet. Sin credenciales configuradas (desarrollo)
 * escribe en data/outbox.jsonl en vez de enviar, así que nada se pierde en silencio.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
	if (!transport) {
		await toOutbox(mail);
		return true;
	}
	try {
		await transport.sendMail({
			from: FROM,
			to: mail.to,
			subject: mail.subject,
			text: mail.text,
			...(mail.replyTo ? { replyTo: mail.replyTo } : {})
		});
		return true;
	} catch (err) {
		// El envío falla en caliente (Mox caído, credenciales, red): al outbox, y que
		// el aviso quede registrado en vez de evaporarse.
		await toOutbox(mail, err instanceof Error ? err.message : 'error');
		return false;
	}
}
