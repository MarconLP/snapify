import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { usePostHog } from "posthog-js/react";
import defaultProfileIcon from "~/assets/default profile icon.jpg";
import Image from "next/image";

export default function ProfileMenu() {
  const { mutateAsync: createBillingPortalSession } =
    api.stripe.createBillingPortalSession.useMutation();
  const { push } = useRouter();
  const { data: session } = useSession();
  const posthog = usePostHog();

  const openBillingSettings = () => {
    void createBillingPortalSession().then(({ billingPortalUrl }) => {
      if (billingPortalUrl) {
        void push(billingPortalUrl);
      }
    });

    posthog?.capture("billing settings opened", {
      stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
    });
  };

  const handleSignOut = () => {
    if (posthog?.__loaded) posthog?.reset();
    void signOut();
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
        <span className="sr-only">Open user menu</span>
        <Image
          className="h-8 w-8 rounded-full"
          src={session?.user?.image ?? defaultProfileIcon}
          alt="profile icon"
          width={32}
          height={32}
          unoptimized
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={openBillingSettings}
                  className={`mx-2 flex h-8 w-40 cursor-pointer flex-row content-center rounded-md p-2 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="leading-2 text-sm leading-4">
                    Billing settings
                  </p>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={handleSignOut}
                  className={`mx-2 flex h-8 w-40 cursor-pointer flex-row content-center rounded-md p-2 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="leading-2 text-sm leading-4">Sign out</p>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
