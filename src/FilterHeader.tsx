import React, { useEffect, useState } from "react";
import { Config, ConfigKey, useConfig } from "./hooks/useConfig";

function FilterHeader(props: {
  config?: Config;
  active: boolean;
  onEdit?: (configKey?: ConfigKey) => void;
}) {
  const { removeConfig, updateConfig } = useConfig((state) => ({
    removeConfig: state.removeConfig,
    updateConfig: state.updateConfig,
  }));

  const handleRemoveConfig = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!props.config) return;
    removeConfig(props.config.key);
  };

  const handleToggleConfig = (e: React.ChangeEvent) => {
    e.preventDefault();
    if (!props.config) return;
    updateConfig({ ...props.config, selected: !props.config.selected });
  };

  useEffect(() => console.log(props.config), [props.config]);
  return (
    <div className="flex items-center gap-2 @container border-b-2 border-slate-100 hover:bg-purple-300">
      <input
        type="checkbox"
        className={`hidden @[6rem]:inline h-4 w-4 text-indigo-600`}
        checked={props.config?.selected ?? false}
        onChange={handleToggleConfig}
      />

      <div
        className={`w-full h-fit flex flex-col`}
        onClick={(e) => {
          e.preventDefault();
          props.onEdit?.(props.config?.key);
        }}
      >
        <div
          className={`w-full flex flex-col  @[6rem]:flex-row items-center gap-2 p-2`}
        >
          {props.config ? (
            <div className="flex flex-col text-xs @[6rem]:flex-row">
              <h3 className="text-left my-0 truncate">
                {props.config?.method}
              </h3>
              <p className="hidden @[6rem]:inline">-</p>
              <h3 className="text-left my-0 truncate">
                {props.config.statusCode}
              </h3>
            </div>
          ) : (
            <p>New Filter</p>
          )}
          {props.config && (
            <div className="hidden @[6rem]:flex  ml-auto gap-2">
              <button
                className="btn btn-xs btn-ghost px-0"
                onClick={handleRemoveConfig}
              >
                <span>{`❌`}</span>
              </button>
            </div>
          )}
        </div>
        <p className="hidden @[6rem]:inline w-full text-left text-xs break-all px-2">
          {props.config?.url}
        </p>
      </div>
    </div>
  );
}

export default FilterHeader;
