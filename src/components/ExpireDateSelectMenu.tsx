import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { getTime } from "~/utils/getTime";

interface Props {
  shareExpiryAt: Date | null;
}

export default function ExpireDateSelectMenu({ shareExpiryAt }: Props) {
  const handleChange = (value) => {
    console.log("selecting value", value);
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
      <Listbox value={shareExpiryAt} onChange={handleChange}>
        <div>
          <Listbox.Button className="h-6 rounded border border-solid border-[#d5d9df] bg-white px-[7px] font-medium">
            <span className="block truncate">
              {typeof shareExpiryAt === null
                ? getTime(shareExpiryAt)
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
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 max-h-[300px] w-[220px] w-full overflow-auto rounded-md bg-white py-1 py-2 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
