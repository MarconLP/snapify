import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import uploadVideoModalOpen from "~/atoms/uploadVideoModalOpen";
import { useAtom } from "jotai";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import paywallAtom from "~/atoms/paywallAtom";
import { useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { env } from "~/env.mjs";

export default function NewVideoMenu() {
  const [, setRecordOpen] = useAtom(recordVideoModalOpen);
  const [, setUploadOpen] = useAtom(uploadVideoModalOpen);
  const [, setPaywallOpen] = useAtom(paywallAtom);
  const { data: session } = useSession();
  const posthog = usePostHog();

  const openRecordModal = () => {
    if (
      !navigator?.mediaDevices?.getDisplayMedia &&
      !navigator?.mediaDevices?.getDisplayMedia
    ) {
      return alert("Your browser is currently NOT supported.");
    }
    setRecordOpen(true);

    posthog?.capture("open record video modal", {
      stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
    });
  };

  const openUploadModal = () => {
    if (
      session?.user.stripeSubscriptionStatus === "active" ||
      !env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ) {
      setUploadOpen(true);

      posthog?.capture("open upload video modal", {
        stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
      });
    } else {
      setPaywallOpen(true);

      posthog?.capture("hit video upload paywall", {
        stripeSubscriptionStatus: session?.user.stripeSubscriptionStatus,
      });
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button>
        <span className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]">
          New video
        </span>
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
                  onClick={openRecordModal}
                  className={`mx-2 flex h-8 w-40 cursor-pointer flex-row content-center rounded-md p-2 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="leading-2 text-sm leading-4">Record a video</p>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={openUploadModal}
                  className={`mx-2 flex h-8 w-40 cursor-pointer flex-row content-center rounded-md p-2 ${
                    active ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="leading-2 text-sm leading-4">Upload a video</p>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
