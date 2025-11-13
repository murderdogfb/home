// src/lib/wp.ts

// Dominio exacto de tu sitio en WP.com
export const SITE = "devcamilocastaneda-nawse.wordpress.com";

// Tipo base: "posts", "pages" o tu CPT si existe y está expuesto
export const TYPE = "posts"; // si luego tienes un CPT "productos", cámbialo aquí

// Construye URL para WP.com (public-api.wordpress.com)
export const wp = (path: string) =>
  `https://public-api.wordpress.com/wp/v2/sites/${SITE}${path}`;

export async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`WP API error ${res.status}: ${url}`);
  return res.json();
}

// ✅ Esta función ya está bien
export function getFeaturedUrl(item: any): string | undefined {
  if (item?.jetpack_featured_media_url) {
    return item.jetpack_featured_media_url;
  }
  return undefined;
}

// ✅ Ahora sí, agregada correctamente y EXPORTADA
// Fallback si solo viene featured_media (ID)
export async function getMediaUrlById(id?: number): Promise<string | undefined> {
  if (!id) return undefined;
  const media = await fetchJSON<any>(wp(`/media/${id}`));
  return media?.source_url || media?.guid?.rendered || undefined;
}
