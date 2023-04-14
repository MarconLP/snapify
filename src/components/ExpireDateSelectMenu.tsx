import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Props {
  shareLinkExpiresAt: Date | null;
  videoId: string;
}

export default function ExpireDateSelectMenu({
  shareLinkExpiresAt,
  videoId,
}: Props) {
  const utils = api.useContext();

  const setShareLinkExpiresAtMutation =
    api.video.setShareLinkExpiresAt.useMutation({
      onMutate: async ({ videoId, shareLinkExpiresAt }) => {
        await utils.video.get.cancel();
        const previousValue = utils.video.get.getData({ videoId });
        if (previousValue) {
          utils.video.get.setData(
            { videoId },
            { ...previousValue, shareLinkExpiresAt }
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

  const handleChange = (value: string) => {
    let timestamp: null | Date = new Date();
    switch (value) {
      case "Never expire":
        timestamp = null;
        break;
      case "In 1 hour":
        timestamp.setHours(timestamp.getHours() + 1);
        break;
      case "In 24 hours":
        timestamp.setDate(timestamp.getDate() + 1);
        break;
      case "In 7 days":
        timestamp.setDate(timestamp.getDate() + 7);
        break;
      case "In 30 days":
        timestamp.setDate(timestamp.getDate() + 30);
        break;
    }

    setShareLinkExpiresAtMutation.mutate({
      videoId,
      shareLinkExpiresAt: timestamp,
    });
  };

  const availableExpireDates = [
    "Never expire",
    "In 1 hour",
    "In 24 hours",
    "In 7 days",
    "In 30 days",
  ];

  return (
    <div>
      <Listbox value={"dummy text"} onChange={handleChange}>
        <div>
          <Listbox.Button className="h-6 rounded border border-solid border-[#d5d9df] bg-white px-[7px] font-medium">
            <span className="block truncate">
              {shareLinkExpiresAt
                ? "In " + dayjs(shareLinkExpiresAt).fromNow(true)
                : "Never expire"}
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 max-h-[300px] w-[220px] overflow-auto rounded-md bg-white py-1 py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {availableExpireDates.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative mx-2 flex h-8 cursor-pointer select-none items-center rounded px-2 ${
                      active ? "bg-[#f3f4f6]" : "text-gray-900"
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {person}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
