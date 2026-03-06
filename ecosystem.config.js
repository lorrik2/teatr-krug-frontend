/** PM2 — Next.js и Strapi. Переменные окружения для связи с API */
const path = require("path");

module.exports = {
  apps: [
    {
      name: "nextjs",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        STRAPI_URL: "https://api.teatr-krug-spb.ru",
        NEXT_PUBLIC_STRAPI_URL: "https://api.teatr-krug-spb.ru",
        USE_STRAPI: "1",
        NEXT_PUBLIC_SITE_URL: "https://teatr-krug-spb.ru",
      },
    },
    {
      name: "strapi",
      cwd: path.join(__dirname, "strapi"),
      script: "node_modules/@strapi/strapi/bin/strapi.js",
      args: "start",
      env: { NODE_ENV: "production" },
    },
  ],
};
