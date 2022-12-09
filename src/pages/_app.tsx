import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import type { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import create from "zustand";
import SearchWithNavigation from "../components/SearchWithNavigation";
import { productsStore } from "../lib/stores/productsStore";
import "../styles/globals.css";
import { getAllCategoriesAsString as getAllCategoriesAsStrings } from "../utils/enumParser";

type ProductSearchStoreType = {
  categories: string[];
  setFilter: (filter: string) => void;
  filter: string;
  selectedCategory: Category | null;
  setSelectedCategory: (newCategory: Category | null) => void;
  categoryDropdownOpen: boolean;
  setCategoryDropdownOpen: (newState: boolean) => void;
};

const productsSearchStore = create<ProductSearchStoreType>()(
  (setState, getState, store) => {
    const allCategories = getAllCategoriesAsStrings();

    const setFilter = (appliedFilter: string) => {
      setState((oldState) => {
        const filteredCategories = allCategories.filter((c) =>
          c.toLowerCase().includes(appliedFilter.toLowerCase())
        );
        return {
          ...oldState,
          filter: appliedFilter,
          categories: filteredCategories,
        };
      });
    };

    const setSelectedCategory = (newCategory: Category | null) => {
      setState((old) => ({ ...old, selectedCategory: newCategory }));
      productsStore.getState().addBasicFilters(getState().filter, newCategory);
    };

    const setCategoryDropdownOpen = (newState: boolean) => {
      setState((old) => ({ ...old, categoryDropdownOpen: newState }));
    };

    return {
      categories: allCategories,
      setFilter,
      selectedCategory: null,
      setSelectedCategory,
      categoryDropdownOpen: false,
      setCategoryDropdownOpen,
      filter: "",
    };
  }
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="container mx-auto min-h-screen">
        <Header />
        <Component {...pageProps} />
        <Footer />
      </div>
    </SessionProvider>
  );
};

const Footer = () => {
  return <footer className="mt-10 p-6"></footer>;
};

const Header = () => {
  const session = useSession();

  const startSignOut = async () => {
    const resp = await signOut({
      redirect: false,
    });
  };

  const startSignIn = () => {
    signIn(
      "google",
      {
        redirect: false,
      },
      {
        prompt: "login",
      }
    );
  };

  return (
    <header className="flex items-center justify-between p-6">
      <Toaster />
      <Link href="/">
        <h1 className="text-2xl">The shop</h1>
      </Link>
      <form className="flex gap-2">
        <ProductSearchDropdown />
        <CategoryDropdown />
      </form>
      <div className="flex items-center gap-8">
        <div className="indicator">
          <span className="badge-primary badge badge-sm indicator-item">
            10+
          </span>
          <Link href="/cart">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </button>
          </Link>
        </div>

        <div className="indicator">
          <span className="badge-primary badge badge-sm indicator-item">
            10
          </span>
          <Link href="/cart">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-8 w-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
            </button>
          </Link>
        </div>

        {session.status === "authenticated" && (
          <>
            <div className="dropdown-end dropdown">
              <button className="placeholder avatar flex items-center">
                <div className="w-8 rounded-full bg-neutral-focus text-neutral-content">
                  <Image
                    src={session.data.user?.image ?? ""}
                    alt="user profile image"
                    width={24}
                    height={24}
                  />
                </div>
              </button>
              <ul
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                tabIndex={0}
              >
                <li
                  onClick={function () {
                    startSignOut();
                  }}
                >
                  <a>Sign out</a>
                </li>
                <li>
                  <a>My account</a>
                </li>
              </ul>
            </div>
          </>
        )}
        {session.status === "unauthenticated" && (
          <button onClick={() => startSignIn()}>Login</button>
        )}
      </div>
    </header>
  );
};

const ProductSearchDropdown = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const searchListElement = useRef<HTMLUListElement>(null);
  const selectedCategory = productsSearchStore(
    (state) => state.selectedCategory
  );
  const trpcContext = trpc.useContext();
  const products = trpc.products.searchForProduct.useQuery({
    searchQuery: inputValue ?? "",
    limit: 10,
    category: selectedCategory,
  });
  const router = useRouter();

  return (
    <>
      <div className="dropdown" key={router.asPath}>
        <div className="relative">
          <SearchWithNavigation
            searchListRef={searchListElement}
            className="input"
            focusOnCtrlK
            placeholder="I am looking for..."
            onChange={(e) => {
              setInputValue(e?.currentTarget?.value ?? "");
              productsSearchStore.setState((old) => ({
                ...old,
                filter: e.currentTarget?.value ?? "",
              }));
              trpcContext.products.searchForProduct.invalidate();
            }}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <kbd className="kbd kbd-sm">ctrl</kbd>+
            <kbd className="kbd kbd-sm">k</kbd>
          </div>
        </div>
        <ul
          className="dropdown-content menu rounded-box mt-2 w-full bg-base-100 p-2 shadow"
          ref={searchListElement}
        >
          {products.status === "loading" && (
            <div className="flex h-full w-full items-center justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {products.status === "success" &&
            (products?.data?.length ?? 0 > 0 ? (
              products?.data?.map((p, idx) => {
                return (
                  <li
                    key={p.id}
                    tabIndex={-1}
                    onClick={() => {
                      router.push("/details/" + p.id);
                    }}
                  >
                    <a>{p.title}</a>
                  </li>
                );
              })
            ) : (
              <div>Not found</div>
            ))}
          {products.status === "error" && <div>ERROR</div>}
        </ul>
      </div>
    </>
  );
};

const CategoryDropdown = () => {
  const id = useId();
  const router = useRouter();
  const setFilter = productsSearchStore((state) => state.setFilter);
  const filter = productsSearchStore((state) => state.filter);
  const [val, setVal] = useState<string>("");
  const selectedCategory = productsSearchStore(
    (state) => state.selectedCategory
  );
  const categories = productsSearchStore((state) => state.categories);
  const categoriesRef = useRef<HTMLUListElement>(null);

  const dropdownOpen = productsSearchStore(
    (state) => state.categoryDropdownOpen
  );

  const openStyle = useMemo(() => {
    const style = dropdownOpen ? "" : "hidden";
    return style;
  }, [dropdownOpen]);

  useEffect(() => {
    setVal(selectedCategory?.replaceAll("_", " ") ?? "");
  }, [selectedCategory]);

  return (
    <>
      <div className={`dropdown`}>
        <div className="flex gap-2">
          <SearchWithNavigation
            key={id}
            searchListRef={categoriesRef}
            value={val}
            onFocus={() =>
              productsSearchStore.getState().setCategoryDropdownOpen(true)
            }
            tabIndex={0}
            className="input"
            placeholder="In category..."
            onChange={(e) => {
              setVal(e.currentTarget.value);
              setFilter(e.currentTarget.value);
            }}
          />
          <button
            className="btn-square btn"
            tabIndex={0}
            onClick={async (e) => {
              e.preventDefault();
              e.currentTarget.focus();
              e.currentTarget.blur();
              await router.push("/");
              productsStore
                .getState()
                .addBasicFilters(
                  productsSearchStore.getState().filter,
                  productsSearchStore.getState().selectedCategory
                );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
        <ul
          className={`dropdown-content menu rounded-box mt-2 w-full bg-base-100 p-2 shadow`}
          ref={categoriesRef}
          key={selectedCategory}
        >
          <li
            tabIndex={0}
            className=""
            key={"ALL_CATEGORIES"}
            onClick={() => {
              productsSearchStore.getState().setSelectedCategory(null);
              productsSearchStore.getState().setCategoryDropdownOpen(false);
            }}
          >
            <a>All categories</a>
          </li>
          {categories.map((c, idx) => (
            <li
              tabIndex={0}
              className=""
              key={c}
              onClick={() => {
                productsSearchStore
                  .getState()
                  .setSelectedCategory(c.replaceAll(" ", "_") as Category);
                productsSearchStore.getState().setCategoryDropdownOpen(false);
              }}
            >
              <a>{c}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export const CategoriesPicker = () => {
  const categories = productsSearchStore((state) => state.categories);
  const selectedCategory = productsSearchStore(
    (state) => state.selectedCategory
  );

  return (
    <div key={selectedCategory}>
      <li
        tabIndex={0}
        className="bg-base-200"
        key={"ALL_CATEGORIES"}
        onClick={() => {
          productsSearchStore.getState().setSelectedCategory(null);
          productsSearchStore.getState().setCategoryDropdownOpen(false);
        }}
      >
        <a>All categories</a>
      </li>
      {categories.map((c, idx) => (
        <li
          tabIndex={0}
          className="bg-base-200"
          key={c}
          onClick={() => {
            productsSearchStore.getState().setSelectedCategory(c as Category);
            productsSearchStore.getState().setCategoryDropdownOpen(false);
          }}
        >
          <a>{c}</a>
        </li>
      ))}
    </div>
  );
};

export default trpc.withTRPC(MyApp);
