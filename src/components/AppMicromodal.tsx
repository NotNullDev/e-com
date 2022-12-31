const AppMicromodal = () => {
  return (
    <>
      <div id="modal-1" aria-hidden="true">
        <div tabIndex={-1} data-micromodal-close>
          <div role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
            <header>
              <h2 id="modal-1-title">Modal Title</h2>

              <button aria-label="Close modal" data-micromodal-close></button>
            </header>

            <div id="modal-1-content">Modal Content</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppMicromodal;
