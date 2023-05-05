import { Config } from "../store/useConfig";

function getTab() {
  return chrome.tabs.query({ active: true }).then((tabs) => tabs[0]);
}

function interceptor(
  url: string,
  method: string,
  statusCode: number,
  responseBody?: string
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

export const applyFilter = async ({
  url,
  method,
  statusCode,
  responseBody,
}: Config) => {
  const tab = await getTab();
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

  return tab;
};
