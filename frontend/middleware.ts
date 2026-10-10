import { NextResponse, type NextRequest } from 'next/server';

// Domaine officiel : toutes les variantes (www, http) sont redirigées en 301
// vers https://garagebellecroix.fr pour éviter le contenu en double sur Google.
const CANONICAL_HOST = 'garagebellecroix.fr';

export function middleware(request: NextRequest) {
  const host = (request.headers.get('host') || '').toLowerCase();
  if (!host.endsWith(CANONICAL_HOST)) return NextResponse.next(); // localhost, aperçus…

  // Protocole vu par le visiteur : Cloudflare l'indique dans cf-visitor, sinon x-forwarded-proto
  let scheme = request.headers.get('x-forwarded-proto') || 'https';
  const cfVisitor = request.headers.get('cf-visitor');
  if (cfVisitor) {
    try {
      scheme = JSON.parse(cfVisitor).scheme || scheme;
    } catch {
      // en-tête illisible : on garde x-forwarded-proto
    }
  }

  const isWww = host === `www.${CANONICAL_HOST}`;
  if (!isWww && scheme === 'https') return NextResponse.next();
  if (!isWww && host !== CANONICAL_HOST) return NextResponse.next(); // autre sous-domaine (api…)

  const url = new URL(request.nextUrl.pathname + request.nextUrl.search, `https://${CANONICAL_HOST}`);
  return NextResponse.redirect(url, 301);
}

export const config = {
  // Pages uniquement (pas les fichiers internes de Next)
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
