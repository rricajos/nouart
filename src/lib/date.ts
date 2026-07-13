// Formateo de fechas de eventos ('YYYY-MM-DD') a español. Client-safe.

export function formatEventDate(date: string): string {
	if (!date) return 'Fecha por confirmar';
	const d = new Date(date + 'T00:00:00');
	if (isNaN(d.getTime())) return date;
	return new Intl.DateTimeFormat('es-ES', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	}).format(d);
}

/** Día y mes cortos para la "tarjeta calendario" (ej. { day: '12', month: 'jul' }). */
export function calendarBadge(date: string): { day: string; month: string } | null {
	if (!date) return null;
	const d = new Date(date + 'T00:00:00');
	if (isNaN(d.getTime())) return null;
	return {
		day: new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(d),
		month: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(d).replace('.', '')
	};
}
