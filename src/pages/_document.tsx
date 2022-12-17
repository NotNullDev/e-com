import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html data-theme="dark" style={{ backgroundColor: "#272935" }}>
      <Head />
      <GlobalModal />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

const GlobalModal = () => {
  return (
    <>
      <input type="checkbox" id="global-modal" className="modal-toggle" />
      <label htmlFor="global-modal" className="modal cursor-pointer">
        <label
          className="modal-box relative flex min-h-[300px] flex-col"
          htmlFor=""
        >
          <div>hello from modal!</div>
          <div className="flex flex-1 flex-col"></div>
          <div className="flex justify-end">
            <div className="modal-action">
              <label htmlFor="global-modal" className="btn-ghost btn">
                delete
              </label>
            </div>
            <div className="modal-action">
              <label
                htmlFor="global-modal"
                className="btn-outline btn-info btn"
              >
                cancel
              </label>
            </div>
          </div>
        </label>
      </label>
    </>
  );
};
