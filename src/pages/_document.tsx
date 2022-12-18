import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dark" style={{ backgroundColor: "#272935" }}>
      <Head />
      <div id="global-modal-placement"></div>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
