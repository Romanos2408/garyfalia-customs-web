/**
 * Prefix a /public asset path with the deploy base path.
 *
 * Next only auto-prefixes its own chunks/CSS with `basePath` — plain string
 * srcs (videos, posters, unoptimized images) are passed through untouched, so
 * on a subpath deploy (GitHub Pages preview at /garyfalia-customs-web) they
 * would 404. Route every public-asset reference through this helper.
 * NEXT_PUBLIC_BASE_PATH is "" everywhere except the Pages export build.
 */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
