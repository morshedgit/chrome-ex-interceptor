import { useState } from "react";
import { ConfigKey, useConfig } from "./store/useConfig";
import Filter from "./Filter";
import { applyFilter, applyFilter2 } from "./services/chrome";
import FilterHeader from "./FilterHeader";

function Filters() {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>();
  const [activeFilter, setActiveFilter] = useState<ConfigKey>();

  const { configs, config } = useConfig((state) => ({
    configs: state.configs,
    config: activeFilter ? state.configs[activeFilter] : undefined,
  }));

  /**
   *
   * @returns
   */
  const handleApply = async () => {
    console.log("Getting The active tabId");
    const tab = await applyFilter(configs);
    setActiveTab(tab);
  };

  /**
   *
   * @returns
   */
  const handleApply2 = async () => {
    console.log("Getting The active tabId");
    const tab = await applyFilter2(configs);
    setActiveTab(tab);
  };

  return (
    <div className="p-4 w-80">
      <h1 className="text-xl font-bold">Intercept Fetch Requests</h1>
      <div className="grid grid-cols-2 gap-2">
        <h2 className="truncate">{activeTab?.title}</h2>
        <div className="flex justify-end gap-2">
          {!activeFilter ? (
            <button
              className="btn btn-primary btn-sm"
              title="Add new filter"
              onClick={() => setActiveFilter("New")}
            >
              +
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              title="Add new filter"
              onClick={() => setActiveFilter(undefined)}
            >
              {`<`}
            </button>
          )}

          {!activeFilter && (
            <>
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={handleApply}
              >
                Apply
              </button>
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={handleApply2}
              >
                Apply2
              </button>
            </>
          )}
        </div>
      </div>
      <section className="flex">
        <ul
          className={`transition-[width] list-none pl-none flex flex-col gap-2 my-2 ${
            activeFilter ? "w-0" : "w-[18rem]"
          } overflow-hidden`}
        >
          {activeFilter === "New" && <Filter active onEdit={setActiveFilter} />}
          {Object.values(configs).map((config) => (
            <FilterHeader
              key={config.key}
              config={config}
              active={config.key === activeFilter}
              onEdit={setActiveFilter}
            />
          ))}
        </ul>
        <div
          className={`transition-[width] ${
            activeFilter ? "w-[18rem]" : "w-0"
          } overflow-hidden`}
        >
          <Filter
            key={config?.key}
            config={config}
            active
            onEdit={setActiveFilter}
          />
        </div>
      </section>
    </div>
  );
}

export default Filters;
