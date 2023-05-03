import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type Stripe from "stripe";
import { buffer } from "micro";
import {
  handleInvoicePaid,
  handleSubscriptionCanceled,
  handleSubscriptionCreatedOrUpdated,
} from "~/server/stripe-webhook-handlers";
import { stripe } from "~/server/stripe";
import { posthog } from "~/server/posthog";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!webhookSecret || !stripe) {
    return res.status(500).end("Stripe env variables not set");
  }

  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig as string, webhookSecret);

      // Handle the event
      switch (event.type) {
        case "invoice.paid":
          // Used to provision services after the trial has ended.
          // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
          await handleInvoicePaid({
            event,
            stripe,
            prisma,
            posthog,
          });
          break;
        case "customer.subscription.created":
          // Used to provision services as they are added to a subscription.
          await handleSubscriptionCreatedOrUpdated({
            event,
            prisma,
            posthog,
          });
          break;
        case "customer.subscription.updated":
          // Used to provision services as they are updated.
          await handleSubscriptionCreatedOrUpdated({
            event,
            prisma,
            posthog,
          });
          break;
        case "invoice.payment_failed":
          // If the payment fails or the customer does not have a valid payment method,
          //  an invoice.payment_failed event is sent, the subscription becomes past_due.
          // Use this webhook to notify your user that their payment has
          // failed and to retrieve new card details.
          // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic

          const subscription = event.data.object as Stripe.Subscription;
          const userId = subscription.metadata.userId;

          if (userId) {
            posthog?.capture({
              distinctId: userId,
              event: "stripe invoice.payment_failed",
            });
            void posthog?.shutdownAsync();
          }
          break;
        case "customer.subscription.deleted":
          // handle subscription cancelled automatically based
          // upon your subscription settings.
          await handleSubscriptionCanceled({
            event,
            prisma,
            posthog,
          });
          break;
        default:
        // Unexpected event type
      }

      // record the event in the database
      await prisma.stripeEvent.create({
        data: {
          id: event.id,
          type: event.type,
          object: event.object,
          api_version: event.api_version,
          account: event.account,
          created: new Date(event.created * 1000), // convert to milliseconds
          data: {
            object: event.data.object,
            previous_attributes: event.data.previous_attributes,
          },
          livemode: event.livemode,
          pending_webhooks: event.pending_webhooks,
          request: {
            id: event.request?.id,
            idempotency_key: event.request?.idempotency_key,
          },
        },
      });

      res.json({ received: true });
    } catch (err) {
      res.status(400).send(err);
      return;
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
