import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

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
  quantity: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const body = req.body as CheckoutSessionRequest;

  const user = session.user;

  if (req.method === "POST") {
    try {
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
            quantity: 1,
            adjustable_quantity: {
              enabled: true,
              maximum: 100,
              minimum: 1,
            },
            price_data: {
              currency: "PLN",
              product_data: {
                name: "Example Product",
                description: "Example Product Description",
                images: ["https://example.com/example.png"],
              },
              unit_amount: 1000,
            },
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/cart?success=true`,
        cancel_url: `${req.headers.origin}/cart?canceled=true`,
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
