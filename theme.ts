"use client";

import { createTheme, MantineColorsTuple } from "@mantine/core";

// Customização das cores violeta
const violet: MantineColorsTuple = [
  "#f5f3ff",
  "#ede9fe",
  "#ddd6fe",
  "#c4b5fd",
  "#a78bfa",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#5b21b6",
  "#4c1d95",
];

export const theme = createTheme({
  primaryColor: "violet",

  fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",

  headings: {
    fontFamily: "var(--font-playfair), Georgia, serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
    },
  },

  colors: {
    violet,
  },

  defaultRadius: "md",

  shadows: {
    sm: "0 1px 3px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.15)",
  },

  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
    },

    Card: {
      defaultProps: {
        radius: "md",
        shadow: "sm",
      },
    },

    Paper: {
      defaultProps: {
        radius: "md",
      },
    },

    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },

    Select: {
      defaultProps: {
        radius: "md",
      },
    },

    Modal: {
      defaultProps: {
        radius: "md",
        overlayProps: {
          backgroundOpacity: 0.55,
          blur: 3,
        },
      },
    },
  },

  // Breakpoints responsivos
  breakpoints: {
    xs: "36em",  // 576px
    sm: "48em",  // 768px
    md: "62em",  // 992px
    lg: "75em",  // 1200px
    xl: "88em",  // 1408px
  },
});
