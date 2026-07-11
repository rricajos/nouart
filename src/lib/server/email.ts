import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DATA_DIR } from './db';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.MAIL_FROM ?? 'Nou Art <noreply@nouart.org>';
const OUTBOX = join(DATA_DIR, 'outbox.jsonl');

interface Mail {
	to: string;
	subject: string;
	text: string;
	replyTo?: string;
}

/**
 * Send an email via Resend. When RESEND_API_KEY is unset (dev / no funds yet)
 * it falls back to appending the message to data/outbox.jsonl so nothing is lost.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
	if (!RESEND_API_KEY) {
		await appendFile(OUTBOX, JSON.stringify({ ...mail, at: new Date().toISOString() }) + '\n');
		return true;
	}
	try {
		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${RESEND_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: FROM,
				to: mail.to,
				subject: mail.subject,
				text: mail.text,
				...(mail.replyTo ? { reply_to: mail.replyTo } : {})
			})
		});
		if (!res.ok) {
			await appendFile(
				OUTBOX,
				JSON.stringify({ ...mail, at: new Date().toISOString(), error: res.status }) + '\n'
			);
			return false;
		}
		return true;
	} catch {
		await appendFile(
			OUTBOX,
			JSON.stringify({ ...mail, at: new Date().toISOString(), error: 'network' }) + '\n'
		);
		return false;
	}
}
