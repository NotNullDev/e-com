import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import create from "zustand";
import "../styles/globals.css";
import { getAllCategoiresAsString as getAllCategoriesAsStrings } from "../utils/enumParser";

type CategoriesStoreType = {
  categories: string[];
  setFilter: (filter: string) => void;
};

const categoriesStore = create<CategoriesStoreType>()(
  (setState, getState, store) => {
    const allCategoires = getAllCategoriesAsStrings();

    const setFilter = (appliedFilter: string) => {
      setState((oldState) => {
        const filteredCategories = allCategoires.filter((c) =>
          c.toLowerCase().includes(appliedFilter.toLowerCase())
        );
        return {
          ...oldState,
          categories: filteredCategories,
        };
      });
    };

    return {
      categories: allCategoires,
      setFilter,
    };
  }
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <div className="container mx-auto h-screen">
        <Header />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

const Header = () => {
  const session = useSession();
  const setFilter = categoriesStore((state) => state.setFilter);

  const startSignOut = () => {
    signOut({
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
        display: "popup",
      }
    );
  };

  return (
    <div className="flex items-center justify-between p-6">
      <Toaster />
      <Link href="/">
        <h1 className="text-2xl">The shop</h1>
      </Link>
      <div className="flex gap-2">
        <input className="input" placeholder="I am looking for..." />

        <div className="dropdown">
          <div className="flex">
            <input
              tabIndex={0}
              className="input"
              placeholder="In category..."
              onChange={(e) => {
                setFilter(e.currentTarget.value ?? "");
              }}
            />
            <button className="btn-square btn" tabIndex={-1}>
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
            tabIndex={0}
            className="dropdown-content menu rounded-box mt-2 w-full bg-base-100 p-2 shadow"
          >
            <CategoriesPicker />
          </ul>
        </div>
      </div>

      <div className="flex items-center gap-6">
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

        {session.status === "authenticated" && (
          <>
            <div className="dropdown dropdown-end">
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
                tabIndex={0}
                className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
              >
                <li onClick={() => startSignOut()}>
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
    </div>
  );
};

export const CategoriesPicker = () => {
  const categories = categoriesStore((state) => state.categories);
  return (
    <>
      {categories.map((c) => (
        <li className="bg-base-200" key={c}>
          <a>{c}</a>
        </li>
      ))}
    </>
  );
};

export default trpc.withTRPC(MyApp);
