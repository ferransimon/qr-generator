import createMiddleware from 'next-intl/middleware';
import { locales } from './lib/i18n';

export default createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
