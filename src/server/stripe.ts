import Stripe from "stripe";
import { env } from "~/env.mjs";

export const stripe = !!env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15",
    })
  : null;
