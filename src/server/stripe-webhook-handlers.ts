import type { PrismaClient } from "@prisma/client";
import type Stripe from "stripe";
import { type PostHog } from "posthog-node";

// retrieves a Stripe customer id for a given user if it exists or creates a new one
export const getOrCreateStripeCustomerIdForUser = async ({
  stripe,
  prisma,
  userId,
}: {
  stripe: Stripe;
  prisma: PrismaClient;
  userId: string;
}): Promise<string | null> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error("User not found");

  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // create a new customer
  const customer = await stripe.customers.create({
    email: user.email ?? undefined,
    name: user.name ?? undefined,
    // use metadata to link this Stripe customer to internal user id
    metadata: {
      userId,
    },
  });

  // update with new customer id
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeCustomerId: customer.id,
    },
  });

  if (updatedUser.stripeCustomerId) {
    return updatedUser.stripeCustomerId;
  }

  return null;
};

export const handleInvoicePaid = async ({
  event,
  stripe,
  prisma,
  posthog,
}: {
  event: Stripe.Event;
  stripe: Stripe;
  prisma: PrismaClient;
  posthog: PostHog | null;
}) => {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription;
  const subscription = await stripe.subscriptions.retrieve(
    subscriptionId as string
  );
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    },
  });

  if (userId && subscription.status) {
    posthog?.capture({
      distinctId: userId,
      event: "stripe invoice.paid",
      properties: {
        stripeSubscriptionStatus: subscription.status,
      },
    });
    void posthog?.shutdownAsync();
  }
};

export const handleSubscriptionCreatedOrUpdated = async ({
  event,
  prisma,
  posthog,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
  posthog: PostHog | null;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // update user with subscription data
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: subscription.id,
      stripeSubscriptionStatus: subscription.status,
    },
  });

  if (userId && subscription.status) {
    posthog?.capture({
      distinctId: userId,
      event: "stripe subscription created or updated",
    });
    void posthog?.shutdownAsync();
  }
};

export const handleSubscriptionCanceled = async ({
  event,
  prisma,
  posthog,
}: {
  event: Stripe.Event;
  prisma: PrismaClient;
  posthog: PostHog | null;
}) => {
  const subscription = event.data.object as Stripe.Subscription;
  const userId = subscription.metadata.userId;

  // remove subscription data from user
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      stripeSubscriptionId: null,
      stripeSubscriptionStatus: null,
    },
  });

  if (userId && subscription.status) {
    posthog?.capture({
      distinctId: userId,
      event: "stripe subscription cancelled",
    });
    void posthog?.shutdownAsync();
  }
};
