import { useState } from "react";
import { ConfigKey, useConfig } from "./hooks/useConfig";
import Filter from "./Filter";
import { applyFilter, applyFilterOnDocumentStart } from "./services/chrome";
import FilterHeader from "./FilterHeader";

function Filters() {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>();
  const [isOnDocStart, setIsOnDocStart] = useState(false);
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
    const applyAction = isOnDocStart ? applyFilterOnDocumentStart : applyFilter;
    const tab = await applyAction(configs);
    setActiveTab(tab);
  };

  return (
    <div className="my-2">
      <div
        className={`${
          activeFilter ? "invisible" : "visible"
        } flex justify-end my-2 btn-group`}
      >
        <button
          className="btn btn-xs btn-primary"
          type="button"
          onClick={handleApply}
        >
          {isOnDocStart ? "Apply on document start" : "Apply"}
        </button>
        <button
          className="btn btn-xs btn-primary relative group"
          type="button"
          tabIndex={0}
          onClick={() => setIsOnDocStart((v) => !v)}
          disabled
        >
          <span className="rotate-90">{`🔃`}</span>
        </button>
      </div>

      <div className="flex gap-2">
        <h2 className="">{activeTab?.title}</h2>
        <div className="flex-grow flex flex-wrap justify-end gap-2">
          {!activeFilter ? (
            <button
              className="btn btn-primary btn-xs"
              title="Add new filter"
              onClick={() => setActiveFilter("New")}
            >
              +
            </button>
          ) : (
            <button
              className="btn btn-primary btn-xs"
              title="Add new filter"
              onClick={() => setActiveFilter(undefined)}
            >
              {`<`}
            </button>
          )}
        </div>
      </div>
      <section className="flex">
        <ul
          className={`transition-[width] pl-none flex flex-col gap-2 my-2 ${
            activeFilter ? "w-[3rem]" : "w-[18rem]"
          } overflow-hidden`}
        >
          {Object.values(configs).map((config) => (
            <li
              key={config.key}
              className={`${
                activeFilter === config.key
                  ? "border-0 border-primary border-solid border-l-2"
                  : ""
              }`}
            >
              <FilterHeader
                key={config.key}
                config={config}
                active={config.key === activeFilter}
                onEdit={setActiveFilter}
              />
            </li>
          ))}
        </ul>
        <div
          className={`transition-[width] ${
            activeFilter ? "w-[15rem]" : "w-0"
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
