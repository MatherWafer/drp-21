/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      // Add other paths if needed
    ],
    theme: {
      extend: {
        // Your existing theme extensions
      },
    },
    variants: {
      extend: {
        padding: ['ios'], // Enable ios variant for padding utilities
        margin: ['ios'],  // Enable ios variant for margin utilities
        // Add other utilities as needed
      },
    },
    plugins: [
      // Add the ios variant plugin
      function({ addVariant }) {
        addVariant(
          'ios', 
          '@supports (padding: max(0px)) and (-webkit-touch-callout: none)'
        );
      },
      // Your other plugins
    ],
  }