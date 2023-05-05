import { Config, ConfigKey, useConfig } from "./store/useConfig";

function FilterHeader(props: {
  config?: Config;
  active: boolean;
  onEdit?: (configKey?: ConfigKey) => void;
}) {
  const { removeConfig, updateConfig } = useConfig((state) => ({
    removeConfig: state.removeConfig,
    updateConfig: state.updateConfig,
  }));

  const handleRemoveConfig = () => {
    if (!props.config) return;
    removeConfig(props.config.key);
  };

  const handleToggleConfig = () => {
    if (!props.config) return;
    updateConfig({ ...props.config, selected: !props.config.selected });
  };
  return (
    <div
      className={`btn w-full h-fit ${
        props.active ? "btn-accent" : "btn-primary"
      } pb-2`}
    >
      <div className={`w-full grid grid-cols-[1fr_5fr_2fr] items-center gap-2`}>
        <input
          type="checkbox"
          className={`form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out ${
            props.config ? "visible" : "invisible"
          }`}
          checked={props.config?.selected}
          onChange={handleToggleConfig}
        />
        {props.config ? (
          <h3 className="text-left truncate">{props.config?.method}</h3>
        ) : (
          <p>New Filter</p>
        )}
        {props.config && (
          <div className="ml-auto flex gap-2">
            <button
              className="btn btn-xs btn-ghost px-0"
              onClick={() => {
                props.onEdit?.(props.config?.key);
              }}
            >
              <span>{`📝`}</span>
            </button>
            <button
              className="btn btn-xs btn-ghost px-0"
              onClick={handleRemoveConfig}
            >
              <span>{`❌`}</span>
            </button>
          </div>
        )}
      </div>
      <p className="w-full text-left text-xs break-all">{props.config?.url}</p>
    </div>
  );
}

export default FilterHeader;
