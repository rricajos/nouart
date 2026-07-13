import { sendMail } from './email';

/** Email de verificación de dirección tras el registro. */
export function sendVerifyEmail(origin: string, to: string, name: string, token: string) {
	return sendMail({
		to,
		subject: 'Verifica tu email · Nou Art',
		text: `Hola ${name},

Confirma tu dirección de email para completar tu cuenta en Nou Art:

${origin}/verify/${token}

Si no te registraste, puedes ignorar este mensaje.

— Nou Art`
	});
}

/** Email de restablecimiento de contraseña (enlace de 1 hora). */
export function sendResetEmail(origin: string, to: string, name: string, token: string) {
	return sendMail({
		to,
		subject: 'Restablece tu contraseña · Nou Art',
		text: `Hola ${name},

Has pedido restablecer tu contraseña en Nou Art. Abre este enlace (válido 1 hora):

${origin}/reset/${token}

Si no lo pediste, ignora este mensaje: tu contraseña no cambiará.

— Nou Art`
	});
}

/** Aviso al artista de que su cuenta ha sido aprobada. */
export function sendArtistApprovedEmail(origin: string, to: string, name: string) {
	return sendMail({
		to,
		subject: 'Tu cuenta de artista está activa · Nou Art',
		text: `Hola ${name},

¡Buenas noticias! El equipo de Nou Art ha aprobado tu cuenta de artista. Ya puedes
editar tu perfil y publicar tu obra desde tu estudio:

${origin}/studio

Un saludo,
Nou Art`
	});
}
