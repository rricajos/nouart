import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Verificación anti-bot propia, SIN terceros (nada de reCAPTCHA/hCaptcha): esos
 * cargarían scripts y cookies externas, obligarían a un banner de consentimiento y
 * son una barrera para gente mayor o poco técnica.
 *
 * Tres capas, ninguna molesta al usuario legítimo:
 *  1. Honeypot (campo oculto que solo rellenan los bots) — ya estaba.
 *  2. Este token: marca de tiempo FIRMADA. Un bot que hace POST directo no la tiene
 *     ni puede falsificarla (no conoce SESSION_SECRET), y si rellena el formulario
 *     en menos de MIN_MS delata que no es humano.
 *  3. Casilla explícita "no soy un robot".
 */
const SECRET = process.env.SESSION_SECRET ?? 'dev-insecure-secret-change-me';
const MIN_MS = 3000; // nadie escribe nombre+email+mensaje en menos de 3 s
const MAX_MS = 2 * 60 * 60 * 1000; // 2 h: formulario abierto demasiado tiempo

export type TokenCheck = 'ok' | 'too-fast' | 'expired' | 'invalid';

function sign(value: string): string {
	return createHmac('sha256', SECRET).update(value).digest('hex');
}

/** Token para incrustar en el formulario al renderizarlo. */
export function issueFormToken(now: number = Date.now()): string {
	return `${now}.${sign(String(now))}`;
}

export function checkFormToken(token: string | null | undefined, now: number = Date.now()): TokenCheck {
	const [tsStr, mac] = String(token ?? '').split('.');
	if (!tsStr || !mac) return 'invalid';

	const expected = sign(tsStr);
	const a = Buffer.from(mac);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return 'invalid';

	const issued = Number(tsStr);
	if (!Number.isFinite(issued)) return 'invalid';
	const age = now - issued;
	if (age < MIN_MS) return 'too-fast';
	if (age > MAX_MS) return 'expired';
	return 'ok';
}
