import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
const Recorder = dynamic(() => import("~/components/Recorder"), { ssr: false });
import dynamic from "next/dynamic";
import { useAtom } from "jotai";
import recordVideoModalOpen from "~/atoms/recordVideoModalOpen";
import { usePostHog } from "posthog-js/react";

export default function VideoRecordModal() {
  const [open, setOpen] = useAtom(recordVideoModalOpen);
  const [step, setStep] = useState<"pre" | "in" | "post">("pre");
  const posthog = usePostHog();

  function closeModal() {
    setStep("pre");
    setOpen(false);
  }

  const handleClose = () => {
    if (step === "pre") closeModal();

    posthog?.capture("cancel video pre-recording");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        {/* backdrop */}
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-fit transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Recorder
                  closeModal={closeModal}
                  step={step}
                  setStep={setStep}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
