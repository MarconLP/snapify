import { Switch } from "@headlessui/react";

interface Props {
  enabled: boolean;
  toggle: () => void;
}

export function ModernSwitch({ enabled, toggle }: Props) {
  return (
    <Switch
      checked={enabled}
      onChange={toggle}
      className={`${
        enabled ? "bg-[#4169e1]" : "bg-gray-200"
      } relative inline-flex h-3.5 w-6 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? "translate-x-2.5" : "translate-x-0"
        } pointer-events-none inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}
