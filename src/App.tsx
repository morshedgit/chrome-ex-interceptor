import { useState } from "react";
import { ConfigKey, useConfig } from "./store/useConfig";
import Filter from "./Filter";
import { applyFilter } from "./services/chrome";

function App() {
  const [activeFilter, setActiveFilter] = useState<ConfigKey>();
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>();
  const { configs } = useConfig((state) => ({
    configs: state.configs,
  }));
  console.log(configs);
  const { removeConfig } = useConfig((state) => ({
    removeConfig: state.removeConfig,
  }));

  /**
   *
   * @returns
   */
  // const handleApply = async () => {
  //   console.log("Getting The active tabId");
  //   const tab = await applyFilter(configs);
  //   setActiveTab(tab);
  // };

  return (
    <main className="p-4 w-80">
      <h1 className="text-xl font-bold">Intercept Fetch Requests</h1>
      <h2>Active Tab: {activeTab?.title}</h2>
      {!activeFilter && <Filter />}
      {Object.values(configs).map((config) => {
        if (config.key === activeFilter) {
          return <Filter key={config.key} config={config} />;
        }
        return (
          <li key={config.key}>
            <dl>
              <dt>
                {config.method}-{config.url}
              </dt>
            </dl>
          </li>
        );
      })}

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
