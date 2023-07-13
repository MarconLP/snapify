import { env } from "~/env.mjs";
import { getOrCreateStripeCustomerIdForUser } from "~/server/stripe-webhook-handlers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({ billedAnnually: z.boolean(), recordModalOpen: z.boolean() })
    )
    .mutation(
      async ({ ctx: { prisma, stripe, session, req, posthog }, input }) => {
        if (
          !stripe ||
          !env.STRIPE_ANNUAL_PRICE_ID ||
          !env.STRIPE_MONTHLY_PRICE_ID
        ) {
          throw new Error("Stripe env variables not set");
        }

        const customerId = await getOrCreateStripeCustomerIdForUser({
          prisma,
          stripe,
          userId: session.user?.id,
        });

        if (!customerId) {
          throw new Error("Could not create customer");
        }

        const baseUrl =
          env.NODE_ENV === "development"
            ? `http://${req.headers.host ?? "localhost:3000"}`
            : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          client_reference_id: session.user?.id,
          payment_method_types: ["card"],
          allow_promotion_codes: true,
          mode: "subscription",
          line_items: [
            {
              price: input.billedAnnually
                ? env.STRIPE_ANNUAL_PRICE_ID
                : env.STRIPE_MONTHLY_PRICE_ID,
              quantity: 1,
            },
          ],
          success_url: input.recordModalOpen
            ? `${baseUrl}/videos?checkoutCanceled=false&close=true`
            : `${baseUrl}/videos?checkoutCanceled=false&close=false`,
          cancel_url: input.recordModalOpen
            ? `${baseUrl}/videos?checkoutCanceled=true&close=true`
            : `${baseUrl}/videos?checkoutCanceled=true&close=false`,
          subscription_data: {
            trial_settings: {
              end_behavior: {
                missing_payment_method: "cancel",
              },
            },
            metadata: {
              userId: session.user?.id,
            },
          },
          payment_method_collection: "if_required",
        });

        if (!checkoutSession) {
          throw new Error("Could not create checkout session");
        }

        posthog?.capture({
          distinctId: session.user.id,
          event: "visiting checkout page",
          properties: {
            billingCycle: input.billedAnnually ? "annual" : "monthly",
          },
        });
        void posthog?.shutdownAsync();

        return { checkoutUrl: checkoutSession.url };
      }
    ),
  createBillingPortalSession: protectedProcedure.mutation(
    async ({ ctx: { stripe, session, prisma, req, posthog } }) => {
      if (!stripe) {
        throw new Error("Stripe env variables not set");
      }

      const customerId = await getOrCreateStripeCustomerIdForUser({
        prisma,
        stripe,
        userId: session.user?.id,
      });

      if (!customerId) {
        throw new Error("Could not create customer");
      }

      const baseUrl =
        env.NODE_ENV === "development"
          ? `http://${req.headers.host ?? "localhost:3000"}`
          : `https://${req.headers.host ?? env.NEXTAUTH_URL}`;

      const stripeBillingPortalSession =
        await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${baseUrl}/videos`,
        });

      if (!stripeBillingPortalSession) {
        throw new Error("Could not create billing portal session");
      }

      posthog?.capture({
        distinctId: session.user.id,
        event: "visiting billing portal page",
        properties: {
          stripeSubscriptionStatus: session.user.stripeSubscriptionStatus,
        },
      });
      void posthog?.shutdownAsync();

      return { billingPortalUrl: stripeBillingPortalSession.url };
    }
  ),
});
