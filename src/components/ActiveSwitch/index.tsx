import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ActiveSwitchProps {
  defaultValue: boolean;
  onStatusChange: (newStatus: boolean) => void;
}

export function ActiveSwitch(props: ActiveSwitchProps) {
  const { defaultValue, onStatusChange } = props;
  const { t } = useTranslation();

  const [status, setStatus] = useState(defaultValue);

  const handleStatusChange = (newStatus: boolean) => {
    if (newStatus !== status) {
      const confirmChange = window.confirm(t("activeSwitch.confirmChange"));
      if (confirmChange) {
        setStatus(newStatus);
        onStatusChange(newStatus);
      }
    }
  };

  return (
    <div className="flex">
      <div className="flex flex-row items-center gap-4 justify-between">
        <div className="flex flex-row justify-center text-xs">
          <div
            onClick={() => handleStatusChange(false)}
            className={`px-3 py-2 rounded-lg cursor-pointer text-white ${
              status === false ? "bg-red-500" : "bg-gray-600 opacity-20"
            }`}
          >
            {t("activeSwitch.inactive")}
          </div>
          <div
            onClick={() => handleStatusChange(true)}
            className={`px-3 py-2 rounded-lg cursor-pointer text-white ${
              status === true ? "bg-green-500" : "bg-gray-600 opacity-20"
            }`}
          >
            {t("activeSwitch.active")}
          </div>
        </div>
      </div>
    </div>
  );
}
