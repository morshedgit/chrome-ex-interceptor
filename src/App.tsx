import { useState } from "react";
import { ConfigKey, useConfig } from "./store/useConfig";
import Filters from "./Filters";
import { applyFilter, applyFilter2 } from "./services/chrome";
import FilterHeader from "./FilterHeader";

enum TABS {
  FILTERS = "FILTERS",
  SETTINGS = "SETTINGS",
}
function App() {
  const [activeTab, setActiveTab] = useState<TABS>(TABS.FILTERS);
  return (
    <main>
      <div className="btn-group">
        <button
          className={`btn ${activeTab === TABS.FILTERS ? "btn-active" : ""}`}
          onClick={() => setActiveTab(TABS.FILTERS)}
        >
          Filters
        </button>
        <button
          className={`btn ${activeTab === TABS.SETTINGS ? "btn-active" : ""}`}
          onClick={() => setActiveTab(TABS.SETTINGS)}
        >
          Settings
        </button>
      </div>

      {activeTab === TABS.FILTERS && <Filters />}
      {activeTab === TABS.SETTINGS && <div>Setting</div>}
    </main>
  );
}

export default App;
