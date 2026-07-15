import { fail } from '@sveltejs/kit';
import { db, type Attachment } from '$lib/server/db';
import { sendMail } from '$lib/server/email';
import { saveAttachment, deleteAttachments, ATTACH_MAX_FILES } from '$lib/server/uploads';
import { contact } from '$lib/content';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		// Honeypot anti-spam.
		if (form.get('website')) return { sent: true, tracked: false };
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();
		const values = { name, email, phone, body };

		if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.length < 2) {
			return fail(400, { error: 'Revisa tu nombre, email y mensaje.', ...values });
		}

		// --- Adjuntos (opcionales) ---
		const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
		if (files.length > ATTACH_MAX_FILES) {
			return fail(400, {
				error: `Puedes adjuntar como máximo ${ATTACH_MAX_FILES} archivos.`,
				...values
			});
		}
		const attachments: Attachment[] = [];
		try {
			for (const f of files) {
				const a = await saveAttachment(f);
				if (a) attachments.push(a);
			}
		} catch (e) {
			// Si uno falla, no dejamos huérfanos en disco los ya guardados.
			await deleteAttachments(JSON.stringify(attachments));
			return fail(400, {
				error: e instanceof Error ? e.message : 'No se pudo adjuntar el archivo.',
				...values
			});
		}

		const fullBody = phone ? `Teléfono: ${phone}\n\n${body}` : body;
		// artist_id NULL = mensaje general a la asociación.
		// user_id → permite al usuario seguir el estado desde /account.
		db.prepare(
			`INSERT INTO messages (artist_id, name, email, body, attachments, user_id)
			 VALUES (NULL, ?, ?, ?, ?, ?)`
		).run(
			name,
			email,
			fullBody,
			attachments.length ? JSON.stringify(attachments) : null,
			locals.user?.id ?? null
		);

		const to = process.env.CONTACT_FALLBACK || contact.email;
		const attachNote = attachments.length
			? `\n\nAdjuntos (${attachments.length}) — descárgalos desde el panel:\n` +
				attachments.map((a) => ` · ${a.name} (${Math.round(a.size / 1024)} KB)`).join('\n')
			: '';
		await sendMail({
			to,
			replyTo: email,
			subject: `Nou Art · nuevo mensaje de ${name}`,
			text: `Mensaje desde el formulario de contacto de nouart.org\n\nDe: ${name} <${email}>\n${phone ? `Teléfono: ${phone}\n` : ''}\n${body}${attachNote}`
		});

		// tracked = ya está ligado a una cuenta; si no, invitamos a crearla.
		return { sent: true, tracked: Boolean(locals.user) };
	}
};
