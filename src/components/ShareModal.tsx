import { Dialog, Switch, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ModernSwitch } from "~/components/ModernSwitch";

export function ShareModal() {
  const [open, setOpen] = useState<boolean>(false);

  const [sharing, setSharing] = useState<boolean>(false);
  const [es, sses] = useState<boolean>(false);
  const [as, ssgs] = useState<boolean>(false);

  const [s, ss] = useState<boolean>(false);

  return (
    <>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]"
      >
        Share
      </span>

      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setOpen(false)}
        >
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle text-[#292D34] shadow-xl transition-all">
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-medium">
                      Share this recording
                    </span>
                    <div className="mt-6 flex w-full items-center justify-between">
                      <span className="text-sm font-medium">
                        Share link with anyone
                      </span>
                      <ModernSwitch enabled={s} toggle={ss} />
                    </div>
                    <button className="my-2 h-8 w-full rounded-md bg-[#4169e1] text-sm font-medium text-white hover:bg-[#224fd7]">
                      Copy public link
                    </button>
                    <div className="w-full border border-solid border-[#e9ebf0] bg-[#fafbfc] px-[15px] py-3 text-xs">
                      <div className="flex h-6 items-center justify-between">
                        <span>Expire link</span>

                        <button className="h-6 rounded border border-solid border-[#d5d9df] bg-white px-[7px]">
                          Never expire
                        </button>
                      </div>
                      <div className="mt-3 flex h-6 items-center justify-between">
                        <span>Delete video when expired</span>
                        <ModernSwitch enabled={s} toggle={ss} />
                      </div>
                      <div className="mt-3 flex h-6 items-center justify-between">
                        <span>Share link with search engines</span>
                        <ModernSwitch enabled={s} toggle={ss} />
                      </div>
                      <div className="mt-3 flex h-6 items-center justify-between">
                        <span>Embed code</span>
                        <button className="h-6 rounded border border-solid border-[#d5d9df] bg-white px-[7px]">
                          Copy code
                        </button>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
