"use client";

import { useEffect } from "react";

export default function ListLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log(window);
    const loadKakaoScript = () => {
      if (window.Kakao) {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
        }
      }
    };

    // Check if the Kakao script is already loaded
    if (!window.Kakao) {
      const script = document.createElement("script");
      script.src = "https://developers.kakao.com/sdk/js/kakao.min.js";
      script.async = true;
      script.onload = loadKakaoScript;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      loadKakaoScript();
    }
  }, []);
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      {children}
    </section>
  );
}
