import type { Config } from "tailwindcss";

const config: Config = {
  // 속성명-[커스텀할 값] 으로 테일윈드 클래스명을 직접 커스텀
  mode: "jit",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "background-pixel": "url('/assets/images/background.png')",
      },
      // theme -> extend -> color구조인데도 tailwindcss 정의 색상 사용하려면 직접 지정해야해..?
      colors: {
        primary: "#2A7443",
        "primary-container": "#7FAC8E",
        secondary: "#FFF600",
        "secondary-container": "#FFFB99",
        "point-orange": "#FFA107",
        "point-orange-container": "#FFC76A",
        "point-brown": "#734700",
        "point-bronw-container": "#AB9166",
        error: "#B83818",
        "error-container": "#D48874",
        "point-pink": "#FFD1BF",
        background: "#F9F9F9",
        "background-container": "#E0E0E0",
        "text-sub": "#868686",
        "home-background": "#97D664",
        outline: "#787D85",
        "outline-container": "#DCE1E9",
        frame: "#F2FFF0",
        "linear-frame": "#C7FFBE",
      },
      fontFamily: {
        // 👇 Add CSS variables
        bitBit: ["var(--font-bitBit)"],
        nexonGothic: ["var(--font-nexonGothic)"],
        nexonGothic_Light: ["var(--font-nexonGothic-Light)"],
        nexonGothic_Medium: ["var(--font-nexonGothic-Medium)"],
        nexonGothic_Bold: ["var(--font-nexonGothic-Bold)"],
        neoDunggeunmo_Pro: ["var(--font-neoDuggeunmo_Pro)"],
      },
    },
  },
  plugins: [],
};
export default config;
