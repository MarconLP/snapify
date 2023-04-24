import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ModernSwitch } from "~/components/ModernSwitch";
import { api, type RouterOutputs } from "~/utils/api";
import ExpireDateSelectMenu from "~/components/ExpireDateSelectMenu";
import { usePostHog } from "posthog-js/react";

interface Props {
  video: RouterOutputs["video"]["get"];
}

export function ShareModal({ video }: Props) {
  const utils = api.useContext();
  const [open, setOpen] = useState<boolean>(false);
  const posthog = usePostHog();

  const openModal = () => {
    setOpen(true);
    posthog?.capture("open video share modal", {
      videoSharing: video.sharing,
      videoId: video.id,
    });
  };

  const closeModal = () => {
    setOpen(false);
    posthog?.capture("close video share modal", {
      videoSharing: video.sharing,
      videoId: video.id,
    });
  };

  const setSharingMutation = api.video.setSharing.useMutation({
    onMutate: async ({ videoId, sharing }) => {
      await utils.video.get.cancel();
      const previousValue = utils.video.get.getData({ videoId });
      if (previousValue) {
        utils.video.get.setData({ videoId }, { ...previousValue, sharing });
      }
      return { previousValue };
    },
    onError: (err, { videoId }, context) => {
      if (context?.previousValue) {
        utils.video.get.setData({ videoId }, context.previousValue);
      }
      console.error(err.message);
    },
  });

  const setDeleteAfterLinkExpiresMutation =
    api.video.setDeleteAfterLinkExpires.useMutation({
      onMutate: async ({ videoId, delete_after_link_expires }) => {
        await utils.video.get.cancel();
        const previousValue = utils.video.get.getData({ videoId });
        if (previousValue) {
          utils.video.get.setData(
            { videoId },
            { ...previousValue, delete_after_link_expires }
          );
        }
        return { previousValue };
      },
      onError: (err, { videoId }, context) => {
        if (context?.previousValue) {
          utils.video.get.setData({ videoId }, context.previousValue);
        }
        console.error(err.message);
      },
    });

  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 5000);

    posthog?.capture("public video link copied", {
      videoSharing: video.sharing,
      videoId: video.id,
    });
  };

  return (
    <>
      <span
        onClick={openModal}
        className="mr-4 max-h-[35px] cursor-pointer rounded border border-[#0000001a] px-2 py-2 text-sm text-[#292d34] hover:bg-[#fafbfc]"
      >
        Share
      </span>

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
                <Dialog.Panel className="w-full max-w-md transform rounded bg-white p-6 text-left align-middle text-[#292D34] shadow-xl transition-all">
                  <div className="flex flex-col items-start">
                    <span className="text-lg font-medium">
                      Share this recording
                    </span>
                    <div className="mt-6 flex w-full items-center justify-between">
                      <span className="text-sm font-medium">
                        Share link with anyone
                      </span>
                      <ModernSwitch
                        enabled={video.sharing}
                        toggle={() =>
                          setSharingMutation.mutate({
                            videoId: video.id,
                            sharing: !video.sharing,
                          })
                        }
                      />
                    </div>
                    {video.sharing ? (
                      <>
                        <button
                          onClick={handleCopy}
                          className="my-2 h-8 w-full rounded-md bg-[#4169e1] text-sm font-medium text-white hover:bg-[#224fd7]"
                        >
                          {linkCopied ? "Copied!" : "Copy public link"}
                        </button>
                        <div className="w-full border border-solid border-[#e9ebf0] bg-[#fafbfc] px-[15px] py-3 text-xs">
                          <div className="flex h-6 items-center justify-between">
                            <span>Expire link</span>
                            <ExpireDateSelectMenu
                              videoId={video.id}
                              shareLinkExpiresAt={video.shareLinkExpiresAt}
                            />
                          </div>
                          <div className="mt-3 flex h-6 items-center justify-between">
                            <span>Delete video after link expires</span>
                            <ModernSwitch
                              enabled={video.delete_after_link_expires}
                              toggle={() =>
                                setDeleteAfterLinkExpiresMutation.mutate({
                                  videoId: video.id,
                                  delete_after_link_expires:
                                    !video.delete_after_link_expires,
                                })
                              }
                            />
                          </div>
                        </div>
                      </>
                    ) : null}
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
