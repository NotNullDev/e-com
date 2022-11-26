import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dracula" style={{ backgroundColor: "#272935" }}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
