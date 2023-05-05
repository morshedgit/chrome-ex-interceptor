import { Config, ConfigKey, useConfig } from "./store/useConfig";

function FilterHeader(props: {
  config?: Config;
  isActive: boolean;
  onEdit: (configKey?: ConfigKey) => void;
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
      className={`flex items-center  justify-start gap-2 btn  w-full ${
        props.isActive ? "btn-accent" : "btn-primary"
      }`}
    >
      <input
        type="checkbox"
        className={`form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out ${
          props.config ? "visible" : "invisible"
        }`}
        checked={props.config?.selected}
        onChange={handleToggleConfig}
      />
      {props.config ? (
        <p>
          {props.config?.method}-{props.config?.url}
        </p>
      ) : (
        <p>New Filter</p>
      )}
      {props.config && (
        <div className="ml-auto flex">
          <button
            className="btn btn-sm btn-primary ml-2"
            onClick={() => {
              props.onEdit(props.config?.key);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-error ml-2"
            onClick={handleRemoveConfig}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default FilterHeader;
