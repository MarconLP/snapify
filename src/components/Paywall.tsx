import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useAtom } from "jotai";
import paywallAtom from "~/atoms/paywallAtom";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { CheckIcon } from "@heroicons/react/20/solid";
import Tooltip from "~/components/Tooltip";
import { usePostHog } from "posthog-js/react";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";

export default function Paywall() {
  const [recordModalOpen] = useAtom(recordVideoModalOpen);
  const { mutateAsync: createCheckoutSession } =
    api.stripe.createCheckoutSession.useMutation();
  const router = useRouter();
  const [open, setOpen] = useAtom(paywallAtom);
  const [billedAnnually, setBilledAnnually] = useState<boolean>(true);
  const posthog = usePostHog();

  function closeModal() {
    setOpen(false);

    posthog?.capture("close paywall");
  }

  const handleCheckout = async () => {
    const { checkoutUrl } = await createCheckoutSession({
      billedAnnually,
      recordModalOpen,
    });
    if (checkoutUrl) {
      if (recordModalOpen) {
        setOpen(false);
        window.open(checkoutUrl, "_blank", "noreferrer,width=500,height=500");
      } else {
        void router.push(checkoutUrl);
      }
    }
  };

  const toggleBillingCycle = () => {
    setBilledAnnually(!billedAnnually);

    posthog?.capture("change billing cycle");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex h-full min-h-full items-center justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="h-full w-full transform overflow-hidden bg-[#f9fafb] text-left align-middle shadow-xl transition-all">
                <button
                  onClick={closeModal}
                  className="absolute right-6 top-6 text-gray-600"
                  tabIndex={0}
                >
                  <CloseIcon />
                </button>
                <div className="mx-auto h-full max-w-7xl overflow-auto px-8 pb-8 pt-20">
                  <section className="relative mx-auto flex max-w-4xl flex-col justify-between gap-8 md:flex-row md:items-center ">
                    <div
                      id="heading-comp-1"
                      className="flex max-w-lg flex-col items-start"
                    >
                      <div className="my-8 ">
                        <h1 className="text-3xl font-bold leading-normal sm:text-4xl sm:leading-normal">
                          Upgrade your plan
                        </h1>
                        <p className="mt-4 pr-8 text-lg text-gray-500">
                          Replace unnecessary meetings that leave you with
                          limited time to focus on more valuable things.
                        </p>
                      </div>
                      <p className="mt-6 text-base text-gray-500">
                        No contract. Cancel any time
                      </p>
                    </div>
                    <div className="w-full md:max-w-sm">
                      <div className="sm:align-center mb-4 flex flex-none flex-wrap items-center gap-4 px-2 py-1 md:justify-center">
                        <div className="relative flex items-center gap-2 text-sm font-medium">
                          <span className="">Monthly</span>
                          <label className="group relative flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600">
                            <input
                              onChange={toggleBillingCycle}
                              checked={billedAnnually}
                              type="checkbox"
                              className="peer absolute left-1/2 hidden h-full w-full -translate-x-1/2 rounded-md"
                            />
                            <span className="flex h-6 w-12 flex-shrink-0 items-center rounded-full bg-gray-300 p-1 duration-300 ease-in-out after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-md after:duration-300 group-hover:after:translate-x-1 peer-checked:bg-[#24b47e] peer-checked:after:translate-x-6">
                              <span className="sr-only" />
                            </span>
                            <span />
                          </label>
                          <span className="opacity-50">Annually</span>
                          <span className="rounded-md bg-[#cbf4c9] px-2 py-1 text-xs text-[#0e6245]">
                            20% Off
                          </span>
                        </div>
                      </div>
                      <div
                        id="pricing-comp"
                        className="w-full flex-none rounded-3xl border bg-white shadow-sm"
                      >
                        <div className="hero relative flex flex-col items-start rounded-3xl px-6 py-6 shadow-sm">
                          <div className="rounded-lg bg-white/20 px-2 font-medium">
                            Pro
                          </div>
                          <div className="mb-2 mt-4 flex items-end text-5xl font-extrabold tracking-tight">
                            {billedAnnually ? "$8" : "$10"}
                            <span className="mb-1 text-sm opacity-80">
                              / mo.
                            </span>
                          </div>
                          <div className="mt-2 text-sm">
                            {billedAnnually
                              ? "billed annually"
                              : "billed monthly"}
                          </div>
                          <div className="mt-2 flex-grow" />
                          <button
                            onClick={() => void handleCheckout()}
                            type="submit"
                            className="btn mt-4 block w-full appearance-none rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-black/50 duration-100 focus:outline-transparent disabled:opacity-80"
                          >
                            Upgrade
                          </button>
                        </div>
                        <div className="mt-4 flex flex-col gap-2 pb-8">
                          {[
                            {
                              feature: "Unlimited recordings",
                              description:
                                "Make and store unlimited recordings of your tab, desktop, and any application.",
                            },
                            {
                              feature: "Video download",
                              description:
                                "Download your recorded videos for offline viewing or sharing with others.",
                            },
                            {
                              feature: "External video upload",
                              description:
                                "Upload videos recorded using other tools or platforms to your Snapify library.",
                            },
                          ].map(({ feature, description }) => (
                            <div
                              key={feature}
                              className="flex items-center gap-2 text-gray-500"
                            >
                              <div className="ml-6 h-5 w-5 flex-none">
                                <CheckIcon />
                              </div>

                              <Tooltip title={description}>
                                <div className="text-base text-gray-500 underline decoration-gray-400 decoration-dashed underline-offset-4">
                                  {feature}
                                </div>
                              </Tooltip>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
