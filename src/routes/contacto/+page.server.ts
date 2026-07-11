import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { sendMail } from '$lib/server/email';
import { contact } from '$lib/content';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		// Honeypot anti-spam.
		if (form.get('website')) return { sent: true };
		const name = String(form.get('name') ?? '').trim();
		const email = String(form.get('email') ?? '').trim();
		const phone = String(form.get('phone') ?? '').trim();
		const body = String(form.get('body') ?? '').trim();

		if (name.length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || body.length < 2) {
			return fail(400, { error: 'Revisa tu nombre, email y mensaje.', name, email, phone, body });
		}

		const fullBody = phone ? `Teléfono: ${phone}\n\n${body}` : body;
		// artist_id NULL = mensaje general a la asociación.
		db.prepare(`INSERT INTO messages (artist_id, name, email, body) VALUES (NULL, ?, ?, ?)`).run(
			name,
			email,
			fullBody
		);

		const to = process.env.CONTACT_FALLBACK || contact.email;
		await sendMail({
			to,
			replyTo: email,
			subject: `Nou Art · nuevo mensaje de ${name}`,
			text: `Mensaje desde el formulario de contacto de nouart.org\n\nDe: ${name} <${email}>\n${phone ? `Teléfono: ${phone}\n` : ''}\n${body}`
		});
		return { sent: true };
	}
};
