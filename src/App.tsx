import { useState } from "react";
import { ConfigKey, useConfig } from "./hooks/useConfig";
import Filters from "./Filters";
import { applyFilter, applyFilterOnDocumentStart } from "./services/chrome";
import FilterHeader from "./FilterHeader";
import Settings from "./Settings";

enum TABS {
  FILTERS = "FILTERS",
  SETTINGS = "SETTINGS",
}
function App() {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.FILTERS);
  return (
    <main className="w-[18rem] px-2">
      <h1 className="text-xl font-bold">Intercept Fetch Requests</h1>
      <div className="btn-group px-4 hidden">
        <button
          className={`btn btn-xs ${
            activeTab === TABS.FILTERS ? "btn-active" : ""
          }`}
          onClick={() => setActiveTab(TABS.FILTERS)}
        >
          Filters
        </button>
        <button
          className={`btn btn-xs ${
            activeTab === TABS.SETTINGS ? "btn-active" : ""
          }`}
          onClick={() => setActiveTab(TABS.SETTINGS)}
        >
          Settings
        </button>
      </div>

      {activeTab === TABS.FILTERS && <Filters />}
      {activeTab === TABS.SETTINGS && <Settings />}
    </main>
  );
}

export default App;
