import { adminSdk } from '@gql/admin/api';
import { writeFileSync } from 'fs';
import globby from 'globby';
import prettier from 'prettier';

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const organizers = await adminSdk.GetAllOrganizerSlugsWithEventsSlugs();
  console.log(organizers);
  const pages = await globby([
    'app/**/pages.tsx',
    '!app/api',
    '!app/crons',
    '!app/[locale]/pass',
  ]);

  const locales = ['en', 'fr'];

  const sitemap = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map((page) => {
            const path = page.replace('app', '').replace('.tsx', '');
            const route = path === '/index' ? '' : path;

            return locales
              .map(
                (locale) => `
                  <url>
                      <loc>${`https://staging.offline.live/${locale}${route}`}</loc>
                  </url>
                `,
              )
              .join('');
          })
          .join('')}
    </urlset>
    `;

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  writeFileSync('public/sitemap.xml', formatted);
}

generate();
