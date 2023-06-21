import {useEffect} from "react";
import {createProductPageStore, deletePopupStore,} from "../../logic/create-products/createProductsPageStore";

export const FilesSelection = () => {
  const files = createProductPageStore((state) => state.files);

  useEffect(() => {
    createProductPageStore.setState((old) => {
      old.files = files;
    });
  }, [files]);

  return (
    <div className="relative w-full p-4">
      <div className="group grid columns-3 grid-cols-4 gap-4">
        {files.map((u, idx) => (
          <label key={idx} className="relative cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={u.url}
              width={400}
              height={200}
              alt="haha"
              className="col-span-1 h-[200px] w-[400px] bg-cover object-contain bg-center"
            />
            <div
              className="invisible absolute right-0 top-0 m-4 h-[24px] w-[24px] gap-2 rounded group-hover:visible group-active:visible">
              <div className="flex w-[100px] flex-nowrap gap-3">
                <input
                  className="checkbox-primary checkbox"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      deletePopupStore.setState((state) => {
                        state.picturesToDeleteIds.push(u.url);
                      });
                    } else {
                      deletePopupStore.setState((state) => {
                        state.picturesToDeleteIds =
                          state.picturesToDeleteIds.filter(
                            (url) => url !== u.url
                          );
                      });
                    }
                  }}
                />
              </div>
            </div>
          </label>
        ))}
        {files.length <= 7 && (
          <>
            <label
              htmlFor="img-input"
              className="flex h-[200px] w-[400px] cursor-pointer items-center justify-center bg-base-300 text-5xl hover:bg-base-200"
            >
              +
              <>
                <input
                  type="file"
                  hidden
                  id="img-input"
                  onChange={(e) => {
                    if (!e.currentTarget.files || !e?.currentTarget?.files[0]) {
                      return;
                    }
                    const file = e?.currentTarget?.files[0];
                    if (file && file.type.startsWith("image/")) {
                      createProductPageStore.setState((state) => {
                        state.files.push({
                          url: URL.createObjectURL(file),
                          file,
                        });
                      });
                    }
                  }}
                />
              </>
            </label>
          </>
        )}
      </div>
    </div>
  );
};
