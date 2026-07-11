export function slugify(input: string): string {
	return input
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60);
}

/** Ensure a slug is unique in a table by appending -2, -3, ... if needed. */
export function uniqueSlug(
	base: string,
	exists: (slug: string) => boolean,
	fallback = 'item'
): string {
	let slug = slugify(base) || fallback;
	let candidate = slug;
	let n = 2;
	while (exists(candidate)) candidate = `${slug}-${n++}`;
	return candidate;
}
