import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { _getCartData } from "../../../server/router/cart";
import type { CartItem } from "../../logic/common/cartStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2022-11-15",
});

export type ProductCheckoutBaseInfo = {
  name: string;
  description: string;
  images: string[];
  quantity: number;
  price: number;
  currency: string;
};

export type CheckoutSessionRequest = {
  data: any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const raw = req.body?.data[0];

  if (!raw) {
    return res.status(400).json({ error: "No items to buy" });
  }

  let boughtItems: CartItem[];

  try {
    boughtItems = (await JSON.parse(raw)) as CartItem[];
  } catch (e) {
    return res.status(400).json({ error: "No items to buy" });
  }

  if (!boughtItems || boughtItems.length === 0) {
    return res.status(400).json({ error: "No items to buy" });
  }

  const user = session.user;

  const r = await _getCartData(boughtItems);

  console.log("boughtItems: ", boughtItems);
  console.log("CART DATA: ", r);

  const items = [
    ...r
      .flatMap((item) => item.products)
      .map((item) => {
        const transformedItem = {
          price_data: {
            currency: "PLN",
            unit_amount: item.price * 100,
            product_data: {
              name: item.title,
            },
            tax_behavior: "inclusive",
          },
          quantity: item.quantity,
        } as Stripe.Checkout.SessionCreateParams.LineItem;

        return transformedItem;
      }),
  ] as Stripe.Checkout.SessionCreateParams.LineItem[];

  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          //   {
          //     price_data: {
          //       unit_amount: 500,
          //       currency: "PLN",
          //       product_data: {
          //         name: "T-shirt",
          //         description: "Comfortable cotton t-shirt",
          //       },
          //     },
          //     quantity: 5,
          //   },
          ...items,
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart?canceled=true&session_id={CHECKOUT_SESSION_ID}`,
        payment_method_options: {
          p24: { tos_shown_and_accepted: true },
        },
      });
      res.redirect(303, session.url ?? "/");
    } catch (err: any) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
