import { writeFileSync } from 'fs';
import { globby } from 'globby';
import { GraphQLClient, gql } from 'graphql-request';
import prettier from 'prettier';

async function generate() {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const pages = await globby([
    'apps/web/app/**/page.tsx',
    '!apps/web/app/api',
    '!apps/web/app/crons',
    '!apps/web/app/[locale]/pass',
  ]);

  const cms = new GraphQLClient(process.env.HYGRAPH_CMS_WEBHOOK_READ_URL, {
    headers: {
      Authorization: process.env.HYGRAPH_CMS_READ_TOKEN_SITEMAP,
    },
  });

  const organizers = await cms.request(gql`
    {
      organizers {
        slug
        events {
          slug
        }
      }
    }
  `);
  const locales = ['en', 'fr'];

  const filteredPages = pages
    .filter((page) => !page.includes('@'))
    .map((page) => page.replace('/page.tsx', ''))
    .map((page) => page.replace(/apps\/web\/app\/?/, ''));

  const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${filteredPages
        .map((page) => {
          return locales
            .map((locale) => {
              let result = '';
              if (
                !page.includes('[organizerSlug]') &&
                !page.includes('[eventSlug]')
              ) {
                result = `
                    <url>
                        <loc>${`https://www.offline.live/${locale}${page}`.replace(
                          '[locale]',
                          '',
                        )}</loc>
                    </url>
                  `;
              }

              if (
                page.includes('[organizerSlug]') ||
                page.includes('[eventSlug]')
              ) {
                result += organizers.organizers
                  .map(({ slug: organizerSlug, events }) => {
                    return events
                      .map(({ slug: eventSlug }) => {
                        let eventPath = page;
                        if (page.includes('[organizerSlug]')) {
                          eventPath = eventPath.replace(
                            '[organizerSlug]',
                            organizerSlug,
                          );
                        }
                        if (page.includes('[eventSlug]')) {
                          eventPath = eventPath.replace(
                            '[eventSlug]',
                            eventSlug,
                          );
                        }
                        eventPath = eventPath
                          .replace('[locale]', '')
                          .replace('/page', '');
                        return `
                            <url>
                                <loc>${`https://www.offline.live/${locale}${eventPath}`}</loc>
                            </url>
                            `;
                      })
                      .join('');
                  })
                  .join('');
              }

              return result;
            })
            .join('');
        })
        .join('')}
  </urlset>
`;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  writeFileSync('apps/web/public/sitemap.xml', formatted);
}

generate();
