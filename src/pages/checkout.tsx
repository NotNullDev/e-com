import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const CheckoutPage = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return <div></div>;
  }

  if (session.status === "unauthenticated") {
    return <div>You must be authenticated to access this page.</div>;
  }

  return <div></div>;
};

export default CheckoutPage;
