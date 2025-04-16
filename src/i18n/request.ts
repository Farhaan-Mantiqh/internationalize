import {NextResponse} from 'next/server';
import requestIp from '@supercharge/request-ip';

export function middleware(request: Request) {
  // Type the request explicitly as NextRequest if needed (if Vercel causes issues with typing)
  const ip = requestIp.getClientIp(request) ?? '';

  const geoApiUrl = `https://ipapi.co/${ip}/json/`;

  return fetch(geoApiUrl)
    .then((res) => res.json())
    .then((data) => {
      const country = data?.country ?? 'Unknown';

      let locale = 'en'; // default locale
      if (country === 'IN') {
        locale = 'hi'; // For India, load 'hi.json'
      } else if (country === 'US') {
        locale = 'en'; // For US, load 'en.json'
      }

      // Set locale in cookies
      const response = NextResponse.next();
      response.cookies.set('locale', locale);
      return response;
    })
    .catch(() => {
      // Default fallback
      const response = NextResponse.next();
      response.cookies.set('locale', 'en'); // default fallback
      return response;
    });
}

export const config = {
  matcher: ['/'] // Adjust to match the paths you want to intercept
};
