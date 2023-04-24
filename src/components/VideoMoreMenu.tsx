import { api, type RouterOutputs } from "~/utils/api";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import {
  DotsHorizontalIcon,
  DownloadIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { usePostHog } from "posthog-js/react";

interface Props {
  video: RouterOutputs["video"]["get"];
}

export default function VideoMoreMenu({ video }: Props) {
  const [title, setTitle] = useState(video.title);
  const [renameMenuOpen, setRenameMenuOpen] = useState<boolean>(false);
  const utils = api.useContext();
  const router = useRouter();
  const posthog = usePostHog();

  const items = [
    {
      name: "Rename",
      icon: <Pencil1Icon />,
      props: {
        onClick: () => {
          setRenameMenuOpen(true);
        },
      },
    },
    {
      name: "Download",
      icon: <DownloadIcon />,
      props: {
        onClick: () => {
          void fetch(video.video_url).then((response) => {
            void response.blob().then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = video.title;
              a.click();
            });
          });

          posthog?.capture("download existing video", {
            videoId: video.id,
          });
        },
      },
    },
    {
      name: "Delete",
      icon: <TrashIcon />,
      props: {
        onClick: () => {
          deleteVideoMutation.mutate({ videoId: video.id });
        },
      },
    },
  ];

  const deleteVideoMutation = api.video.deleteVideo.useMutation({
    onMutate: async ({ videoId }) => {
      await utils.video.get.cancel();
      const previousValue = utils.video.get.getData({ videoId });
      if (previousValue) {
        utils.video.get.setData({ videoId }, { ...previousValue, title });
      }
      void utils.video.getAll.invalidate();
      return { previousValue };
    },
    onError: (err, { videoId }, context) => {
      if (context?.previousValue) {
        utils.video.get.setData({ videoId }, context.previousValue);
      }
      console.error(err.message);
    },
    onSettled: () => {
      void utils.video.getAll.invalidate();
      void router.push("/videos");
    },
  });

  const renameVideoMutation = api.video.renameVideo.useMutation({
    onMutate: async ({ videoId, title }) => {
      await utils.video.get.cancel();
      const previousValue = utils.video.get.getData({ videoId });
      if (previousValue) {
        utils.video.get.setData({ videoId }, { ...previousValue, title });
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

  return (
    <>
      {/* More options menu */}
      <Menu as="div" className="relative mr-4 inline-block text-left">
        <div>
          <Menu.Button className="inline-flex h-full w-full justify-center rounded-full px-4 py-2 text-sm font-medium text-[#292D34] hover:bg-[#fafbfc] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <DotsHorizontalIcon />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {items.map((item) => (
                <div className="h-8" key={item.name} {...item.props}>
                  <Menu.Item>
                    {({ active }) => (
                      <div
                        className={`mx-2 flex h-8 w-40 cursor-pointer flex-row content-center rounded-md p-2 ${
                          active ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="mr-2 flex w-4 content-center justify-center">
                          {item.icon}
                        </div>
                        <p className="leading-2 text-sm leading-4">
                          {item.name}
                        </p>
                      </div>
                    )}
                  </Menu.Item>
                </div>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Rename dialog */}
      <Transition appear show={renameMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setRenameMenuOpen(false)}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      renameVideoMutation.mutate({
                        videoId: video.id,
                        title,
                      });
                      setRenameMenuOpen(false);
                    }}
                  >
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Video title
                      </label>
                      <div className="mt-2">
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.currentTarget.value)}
                          id="title"
                          name="title"
                          type="title"
                          autoComplete="title"
                          className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
