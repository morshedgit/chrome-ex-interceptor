import { Config, ConfigKey, useConfig } from "./hooks/useConfig";
import { options } from "./data/options";

function Filter(props: {
  config?: Config;
  active: boolean;
  onEdit?: (configKey?: ConfigKey) => void;
}) {
  const config = props.config ?? {
    key: "new",
    url: "test",
    method: "GET",
    statusCode: 200,
    responseBody: "",
  };

  /**
   *
   */
  const { updateConfig } = useConfig((state) => ({
    updateConfig: state.updateConfig,
  }));
  /**
   *
   */
  const { addConfig } = useConfig((state) => ({
    addConfig: state.addConfig,
  }));

  /**
   *
   * @param e
   * @returns
   */
  const handleSubmit:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const { url, method, statusCode, responseBody } = Object.fromEntries(
      formData
    ) as unknown as {
      url: string;
      method: string;
      statusCode: number;
      responseBody: string;
    };

    const encoder = new TextEncoder();
    const data = encoder.encode(
      JSON.stringify({ url, method, statusCode, responseBody })
    );

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const key: ConfigKey = props.config ? props.config.key : hashHex;

    const modifiedConfig = { key, url, method, statusCode, responseBody };
    if (props.config) updateConfig(modifiedConfig);
    else {
      addConfig(modifiedConfig);
      props.onEdit?.(key);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`h-0 overflow-hidden ${
        props.active ? "h-[30rem]" : ""
      } transition-[height]`}
    >
      <fieldset className="border border-solid border-primary p-4 rounded-lg">
        <legend>Filters</legend>
        <label htmlFor="url" className="block">
          URL Endpoint
        </label>
        <input
          type="text"
          name="url"
          defaultValue={config.url}
          placeholder="dev.url.studyporter.com"
          className="w-full input input-sm z-10"
        />
        <label htmlFor="method" className="block">
          Request Method
        </label>
        <select
          name="method"
          id="method"
          defaultValue={config.method}
          className="w-full select select-sm"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
          <option value="HEAD">HEAD</option>
          <option value="OPTIONS">OPTIONS</option>
        </select>
      </fieldset>

      <fieldset className="border border-solid border-primary p-4 rounded-lg">
        <legend>Response</legend>
        <label htmlFor="statusCode" className="block">
          Status Code
        </label>
        <select
          name="statusCode"
          id="statusCode"
          className="w-full select select-sm"
          defaultValue={config.statusCode}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <label htmlFor="responseBody" className="block">
          Response Body
        </label>
        <textarea
          id="responseBody"
          name="responseBody"
          className="w-full textarea"
          defaultValue={config.responseBody}
          placeholder={JSON.stringify(
            {
              title: "Student",
            },
            null,
            2
          )}
        ></textarea>
      </fieldset>
      <div className="py-2 w-full flex justify-between gap-2">
        <button className="btn btn-sm btn-primary" type="submit">
          {props.config ? "Save" : "Add"}
        </button>
      </div>
    </form>
  );
}

export default Filter;
