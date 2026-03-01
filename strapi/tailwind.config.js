/** Tailwind config для сборки админ-панели Strapi. Устраняет предупреждение "content option is missing or empty". */
module.exports = {
  content: [
    "./src/admin/**/*.{js,jsx,ts,tsx}",
    "./src/extensions/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
