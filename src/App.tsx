import { useState } from "react";
import { useConfig } from "./store/useConfig";

function getTab() {
  return chrome.tabs.query({ active: true }).then((tabs) => tabs[0]);
}

function interceptor(
  url: string,
  method: string,
  statusCode: number,
  responseBody: string
) {
  const options: ResponseInit = {
    status: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
  };

  document.title = `Intercepted: ${document.title}`;
  document.body.style.borderTop = "5px solid red";
  const oldFetch = window.fetch;
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    if (
      typeof input !== "string" ||
      (url && !input?.includes(url)) ||
      (method && init?.method !== method)
    ) {
      return oldFetch.call(window, input, init);
    }

    console.log("Return Error Response");

    return new Response(responseBody, options);
  };
}

interface Option {
  value: number;
  label: string;
}

const options: Option[] = [
  { value: 200, label: "200 OK" },
  { value: 201, label: "201 Created" },
  { value: 204, label: "204 No Content" },
  { value: 301, label: "301 Moved Permanently" },
  { value: 302, label: "302 Found" },
  { value: 303, label: "303 See Other" },
  { value: 307, label: "307 Temporary Redirect" },
  { value: 308, label: "308 Permanent Redirect" },
  { value: 400, label: "400 Bad Request" },
  { value: 401, label: "401 Unauthorized" },
  { value: 403, label: "403 Forbidden" },
  { value: 404, label: "404 Not Found" },
  { value: 405, label: "405 Method Not Allowed" },
  { value: 409, label: "409 Conflict" },
  { value: 410, label: "410 Gone" },
  { value: 412, label: "412 Precondition Failed" },
  { value: 413, label: "413 Payload Too Large" },
  { value: 415, label: "415 Unsupported Media Type" },
  { value: 422, label: "422 Unprocessable Entity" },
  { value: 429, label: "429 Too Many Requests" },
  { value: 500, label: "500 Internal Server Error" },
  { value: 501, label: "501 Not Implemented" },
  { value: 502, label: "502 Bad Gateway" },
  { value: 503, label: "503 Service Unavailable" },
  { value: 504, label: "504 Gateway Timeout" },
];

function App() {
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | undefined>();
  const { config } = useConfig((state) => ({ config: state.config }));
  const { updateConfig } = useConfig((state) => ({
    updateConfig: state.updateConfig,
  }));

  /**
   *
   * @returns
   */
  const handleStart = async () => {
    console.log("Getting The active tabId");
    const { url, method, statusCode, responseBody } = config;
    const tab = await getTab();

    setActiveTab(tab);
    const tabId = tab.id;

    if (!tabId) return;

    chrome.scripting
      .executeScript({
        world: "MAIN",
        target: { tabId },
        func: interceptor,
        args: [url, method, statusCode, responseBody],
      })
      .then(() => console.log("injected a function"));
  };

  /**
   *
   * @param e
   * @returns
   */
  const handleSubmit: React.FormEventHandler<HTMLFormElement> | undefined = (
    e
  ) => {
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

    if (!url || !method) {
      alert("Please fill the form");
      return;
    }
    updateConfig({ url, method, statusCode, responseBody });
  };

  /**
   * Enables the apply rules buttons
   */
  const isValid =
    config.url && config.method && config.statusCode && config.responseBody;

  return (
    <main className="p-4 w-80">
      <h1 className="text-xl font-bold">Intercept Fetch Requests</h1>
      <h2>Active Tab: {activeTab?.title}</h2>
      <form onSubmit={handleSubmit}>
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
            className="w-full input input-sm"
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
            Save
          </button>
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={handleStart}
            disabled={!isValid}
          >
            Apply
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
