import { useState } from "react";
import { ConfigKey, useConfig } from "./hooks/useConfig";
import Filters from "./Filters";
import { applyFilter, applyFilterOnDocumentStart } from "./services/chrome";
import FilterHeader from "./FilterHeader";
import { useSettings } from "./hooks/useSettings";

function Settings() {
  const { settings } = useSettings((state) => ({ settings: state.setting }));
  return (
    <div>
      {settings.map((setting) => (
        <li key={setting}>{setting}</li>
      ))}
    </div>
  );
}

export default Settings;
