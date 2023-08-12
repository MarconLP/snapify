import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Head from "next/head";
import { useState } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import Tooltip from "~/components/Tooltip";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/20/solid";
import CTA from "~/components/CTA";
import VideoRecordModal from "~/components/VideoRecordModal";
import { usePostHog } from "posthog-js/react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Pricing() {
  const [billedAnnually, setBilledAnnually] = useState<boolean>(true);
  const posthog = usePostHog();

  const toggleBillingCycle = () => {
    setBilledAnnually(!billedAnnually);

    posthog?.capture("change billing cycle");
  };

  return (
    <>
      <Head>
        <title>Snapify | Pricing</title>
        <meta
          name="description"
          content="Share high-quality videos asynchronously and collaborate on your own schedule"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="my-20 flex h-40 flex-col items-center justify-center sm:mx-10 lg:mx-20">
        <span className="text-center text-4xl font-bold lg:text-7xl">
          Choose the plan that fits your needs.
        </span>
      </div>

      <div className="-mt-10 mb-10 flex flex-col items-center justify-center sm:mx-10 lg:mx-20">
        <div className="z-20 mt-4 flex items-center gap-2 lg:mt-8">
          <div
            className="relative flex w-full rounded-full border border-[#b0b0b0] bg-gray-200/70"
            onClick={toggleBillingCycle}
          >
            <button
              className={`rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition focus:z-10 focus:outline-none focus:ring-0 sm:w-auto ${
                billedAnnually ? "" : "bg-white"
              }`}
            >
              <span>Monthly</span>
            </button>
            <button
              className={`ml-0.5 rounded-full border border-transparent px-4 py-2 text-sm font-medium text-gray-700 transition duration-150 focus:z-10 focus:ring-0 sm:w-auto ${
                billedAnnually ? "bg-white" : ""
              }`}
            >
              <span>Annually</span>
              <span className="ml-2 rounded-lg bg-neutral-200 p-1 text-xs font-normal">
                -20%
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative mx-4 mb-20 flex flex-col items-start justify-center gap-12 md:flex-row md:gap-4 lg:mx-16 lg:gap-16">
        <div className="absolute left-[calc(50%_-_calc(min(75vw,500px)_/_2))] h-[min(75vw,500px)] w-[min(75vw,500px)] bg-[radial-gradient(circle_at_center,#666_0,#fff_100%)] opacity-80 blur-[calc(0.5_*_min(75vw,500px))]"></div>
        {[
          {
            name: "Pro",
            price: { monthly: "$10", annual: "$8" },
            features: [
              {
                feature: "Unlimited recordings",
                description:
                  "Make and store unlimited recordings of your tab, desktop, and any application.",
                included: true,
              },
              {
                feature: "Video download",
                description:
                  "Download your recorded videos for offline viewing or sharing with others.",
                included: true,
              },
              {
                feature: "External video upload",
                description:
                  "Upload videos recorded using other tools or platforms to your Snapify library.",
                included: true,
              },
            ],
          },
        ].map(({ name, price, features }) => (
          <div
            key={name}
            className="relative w-full max-w-[400px] flex-1 rounded-3xl border bg-white shadow-sm"
          >
            {name === "Pro" ? (
              <div className="absolute -top-6 left-2/4 z-[1] mt-0 -translate-x-2/4 cursor-default select-none rounded-3xl border-0 border-solid border-[#eaeaea] bg-[linear-gradient(180deg,rgba(0,0,0,.8),#000)] px-[22px] py-3.5 text-white shadow-[0_8px_30px_rgb(0_0_0/6%)] backdrop-blur-[2px]">
                <span className="text-xs font-bold">Most Popular</span>
              </div>
            ) : null}
            <div className="hero relative flex flex-col items-start rounded-3xl px-6 py-6 shadow-sm">
              <div className="rounded-lg bg-white/20 px-2 font-medium">
                {name}
              </div>
              <div className="mb-2 mt-4 flex items-end text-5xl font-extrabold tracking-tight">
                {billedAnnually ? price.annual : price.monthly}
                <span className="mb-1 text-sm opacity-80">/ mo.</span>
              </div>
              <div className="mt-2 text-sm">
                {billedAnnually ? "billed annually" : "billed monthly"}
              </div>
              <div className="mt-2 flex-grow" />
              <button
                onClick={() => void signIn()}
                type="submit"
                className="btn mt-4 block w-full appearance-none rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-black/50 duration-100 focus:outline-transparent disabled:opacity-80"
              >
                Get started
              </button>
            </div>
            <div className="mt-4 flex flex-col gap-2 pb-8">
              {features.map(({ feature, description, included }) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-gray-500"
                >
                  <div className="ml-6 h-5 w-5 flex-none">
                    {included ? <CheckIcon /> : <XMarkIcon />}
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
        ))}
        <div
          key={"enterprise"}
          className="relative w-full max-w-[400px] flex-1 rounded-3xl border bg-white shadow-sm"
        >
          <div className="hero relative flex flex-col items-start rounded-3xl px-6 py-6 shadow-sm">
            <div className="rounded-lg bg-white/20 px-2 font-medium">
              Enterprise
            </div>
            <div className="mb-2 mt-4 flex items-end text-5xl font-extrabold tracking-tight">
              Custom
            </div>
            <div className="mt-2 text-sm">
              Contact us for a custom quote and a custom onboarding process.
            </div>
            <div className="mt-2 flex-grow" />
            <Link
              href="mailto:sales@snapify.it"
              onClick={() =>
                posthog?.capture("clicked contact enterprise plan")
              }
              className="btn mt-4 block w-full appearance-none rounded-lg bg-black px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg shadow-black/50 duration-100 focus:outline-transparent disabled:opacity-80"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center border-y border-[#eaeaea] bg-[#fafafa] pb-8">
        <div className="mb-12 mt-8">
          <span className="text-5xl font-bold">FAQs</span>
        </div>
        <div className="flex flex-1 border-collapse flex-col justify-center px-6">
          {[
            {
              question: "What are my payment options?",
              answer:
                "You can be billed monthly, but save 20% if you pay annually. We currently accept credit card payment. Contact us at hello@snapify.it if you need an alternative payment method.",
            },
            {
              question: "Can I import videos I already recorded?",
              answer: "Yes! Snapify allows you to import your existing videos.",
            },
            {
              question: "How do I contact Support?",
              answer:
                "If you need to contact our Support, click the menu on the bottom right to start a chat.",
            },
          ].map(({ answer, question }) => (
            <Disclosure
              key={question}
              as="div"
              className="max-w-[80vw] sm:w-[600px]"
            >
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex h-12 w-full items-center justify-between border-t border-[#eaeaea] px-4 py-8 text-left text-sm font-medium">
                    <span>{question}</span>
                    <ChevronUpIcon
                      className={`transition-transform ${
                        open ? "rotate-180" : ""
                      } h-5 w-5`}
                    />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Disclosure.Panel className="px-4 pb-2 pt-0 text-sm text-gray-500">
                      {answer}
                    </Disclosure.Panel>
                  </Transition>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </div>

      <CTA />

      <Footer />

      <VideoRecordModal />
    </>
  );
}
