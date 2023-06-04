import { useSession } from "next-auth/react";
import Link from "next/link";
import { SingleItemPrev } from "../components/account/ItemCard";
import { AccountPageModal } from "../components/account/Modal";
import { NoItem } from "../components/account/NoItem";
import { createProductPageStore } from "../logic/create-products/createProductsPageStore";
import { trpc } from "../utils/trpc";

const AccountPage = () => {
  const session = useSession();
  const { data, status } = trpc.products.getOwnProducts.useQuery({
    limit: 10,
    offset: 0,
  });

  if (session.status === "unauthenticated" || session.status === "loading") {
    return <div></div>;
  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="relative flex flex-1 flex-col gap-6 p-8 text-3xl">
        <div className="flex w-full justify-between">
          <h1 className="flex ">My products</h1>
          <Link
            href="/create-product"
            onClick={() => {
              createProductPageStore.setState((state) => {
                state.isUpdating = false;
              });
            }}
          >
            <button className="btn-primary btn">Add product</button>
          </Link>
        </div>
        {data?.length === 0 && <NoItem />}
        <div className="flex flex-col gap-2 text-base">
          {data?.map((d) => {
            return <SingleItemPrev key={d.id} product={d} />;
          })}
        </div>
      </div>
      <AccountPageModal />
    </>
  );
};

export default AccountPage;
