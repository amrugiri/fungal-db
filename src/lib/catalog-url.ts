/** Collection homepages are not strain records. */
const COLLECTION_HOMEPAGES = new Set([
  "https://www.atcc.org",
  "https://www.atcc.org/",
  "https://wi.knaw.nl",
  "https://wi.knaw.nl/",
]);

export function isStrainProductUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  if (COLLECTION_HOMEPAGES.has(url)) return false;
  return /\/products\/[A-Za-z0-9._-]+/.test(url);
}
