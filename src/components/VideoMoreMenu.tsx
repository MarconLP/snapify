import { type RouterOutputs } from "~/utils/api";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  DotsHorizontalIcon,
  DownloadIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";

interface Props {
  video: RouterOutputs["video"]["get"];
}

export default function VideoMoreMenu({ video }: Props) {
  const items = [
    {
      name: "Rename",
      icon: <Pencil1Icon />,
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
            //window.location.href = response.url;
          });
        },
      },
    },
    {
      name: "Delete",
      icon: <TrashIcon />,
    },
  ];

  return (
    <Menu as="div" className="relative mr-4 inline-block text-left">
      <div>
        <Menu.Button className="inline-flex h-full w-full justify-center rounded-full px-4 py-2 text-sm font-medium text-black text-white hover:bg-[#fafbfc] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
        <Menu.Items className="absolute	right-0 z-20 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                      <p className="leading-2 text-sm leading-4">{item.name}</p>
                    </div>
                  )}
                </Menu.Item>
              </div>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
