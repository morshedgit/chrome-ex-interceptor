import { useState } from "react";
import { ConfigKey, useConfig } from "./store/useConfig";
import Filter from "./Filter";
import { applyFilter } from "./services/chrome";

function App() {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>();
  const { configs } = useConfig((state) => ({
    configs: state.configs,
  }));
  const [activeFilter, setActiveFilter] = useState<ConfigKey>();

  /**
   *
   * @returns
   */
  const handleApply = async () => {
    console.log("Getting The active tabId");
    const tab = await applyFilter(configs);
    setActiveTab(tab);
  };

  return (
    <main className="p-4 w-80">
      <div className="flex gap-2">
        <h1 className="text-xl font-bold">Intercept Fetch Requests</h1>
        <button
          className="btn btn-primary btn-sm"
          title="Add new filter"
          onClick={() => setActiveFilter(undefined)}
        >
          +
        </button>
      </div>
      <h2>Active Tab: {activeTab?.title}</h2>
      <ul className="list-none pl-none flex flex-col gap-2 my-2 w-full">
        {!activeFilter && (
          <Filter isActive={!activeFilter} onEdit={setActiveFilter} />
        )}
        {Object.values(configs).map((config) => (
          <Filter
            key={config.key}
            config={config}
            isActive={config.key === activeFilter}
            onEdit={setActiveFilter}
          />
        ))}
      </ul>

      <button
        className="btn btn-sm btn-primary"
        type="button"
        // onClick={handleApply}
      >
        Apply
      </button>
    </main>
  );
}

export default App;
