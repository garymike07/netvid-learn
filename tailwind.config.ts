import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        tertiary: {
          DEFAULT: "hsl(var(--tertiary))",
          foreground: "hsl(var(--tertiary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      backgroundImage: {
        hero: "var(--gradient-hero)",
        card: "var(--gradient-card)",
        accent: "var(--gradient-accent)",
        promo: "var(--gradient-promo)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        emphasized: "var(--motion-ease-emphasized)",
        entrance: "var(--motion-ease-entrance)",
        exit: "var(--motion-ease-exit)",
      },
      transitionDuration: {
        xs: "var(--motion-duration-xs)",
        sm: "var(--motion-duration-sm)",
        md: "var(--motion-duration-md)",
        lg: "var(--motion-duration-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px) scale(0.96)",
          },
          "60%": {
            opacity: "1",
            transform: "translateY(-4px) scale(1)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        float: {
          "0%": {
            transform: "translate3d(0, 0, 0)",
          },
          "50%": {
            transform: "translate3d(0, -12px, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.45)",
          },
          "50%": {
            boxShadow: "0 0 0 12px rgba(99, 102, 241, 0)",
          },
        },
        shine: {
          "0%": {
            transform: "translateX(-150%) rotate(25deg)",
          },
          "100%": {
            transform: "translateX(150%) rotate(25deg)",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "50%": {
            transform: "translateX(15%)",
          },
          "100%": {
            transform: "translateX(120%)",
          },
        },
        "tilt-hover": {
          "0%": {
            transform: "rotateX(0deg) rotateY(0deg)",
          },
          "100%": {
            transform: "rotateX(6deg) rotateY(-4deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shine: "shine 2.2s ease-in-out infinite",
        shimmer: "shimmer 2.6s ease infinite",
        "tilt-hover": "tilt-hover 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
