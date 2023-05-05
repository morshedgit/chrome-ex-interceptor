import { Config, Configs } from "../store/useConfig";

function getTab() {
  return chrome.tabs.query({ active: true }).then((tabs) => tabs[0]);
}

function interceptor(args: string) {
  const filters = JSON.parse(args) as Config[];
  document.title = `Intercepted: ${document.title}`;
  document.body.style.borderTop = "5px solid red";

  const oldFetch = window.fetch;
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    for (const filter of filters) {
      if (typeof input === "string") {
        if (filter.method === init?.method)
          return new Response(filter.responseBody, {
            status: filter.statusCode,
            headers: { "Content-Type": "application/json" },
          });
        else return oldFetch.call(window, input, init);
      }

      if (input instanceof URL)
        if (filter.method === init?.method && input.href.includes(filter.url))
          return new Response(filter.responseBody, {
            status: filter.statusCode,
            headers: { "Content-Type": "application/json" },
          });
        else return oldFetch.call(window, input, init);

      if (filter.method === init?.method && input.url.includes(filter.url))
        return new Response(filter.responseBody, {
          status: filter.statusCode,
          headers: { "Content-Type": "application/json" },
        });
    }
    return oldFetch.call(window, input, init);
  };
}

export const applyFilter = async (configs: Configs) => {
  const tab = await getTab();
  const tabId = tab.id;

  if (!tabId) return;

  const args = JSON.stringify(
    Object.values(configs).filter((config) => config.selected)
  );

  chrome.scripting
    .executeScript({
      world: "MAIN",
      target: { tabId },
      func: interceptor,
      args: [args],
    })
    .then(() => console.log("injected a function"));

  return tab;
};
