import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ja'],
  defaultLocale: 'ja',
  localePrefix: 'always'
});

export const config = {
  matcher: ['/', '/(ja|en)/:path*']
}; 