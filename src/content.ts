type StorageArea = chrome.storage.StorageArea;

export type ConfigKey = string;
export type Config = {
  key: ConfigKey;
  url: string;
  method: string;
  statusCode: number;
  responseBody?: string;
  selected?: boolean;
};
export type Configs = Record<ConfigKey, Config>;

class AppStorage {
  private storage: StorageArea | Storage;

  constructor() {
    this.storage = chrome?.storage?.local ?? localStorage;
  }

  set<T>(key: string, value: T): Promise<void> {
    const data = { [key]: value };
    if (chrome?.storage?.local) {
      return new Promise((resolve) => {
        this.storage.set(data, () => {
          console.log(`Setting data: ${JSON.stringify(data)}`);
          resolve();
        });
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
  }

  get<T>(key: string): Promise<T | null> {
    if (chrome?.storage?.local) {
      return new Promise((resolve) => {
        this.storage.get(key, (result: any) => {
          console.log(`Reading date: ${JSON.stringify(result)}`);
          resolve(result[key]);
        });
      });
    } else {
      const value = localStorage.getItem(key);
      return Promise.resolve(value ? JSON.parse(value) : null);
    }
  }
}

const appStorage = new AppStorage();

async function interceptor() {
  const configs = await appStorage.get<Configs>("config");
  if (!configs) {
    throw new Error("Config not found!");
  }
  const filters = Object.values(configs).filter((config) => config.selected);
  console.log({ filters });
  document.title = `Intercepted: ${document.title}`;
  document.body.style.borderTop = "5px solid red";

  const oldFetch = window.fetch;
  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ): Promise<Response> => {
    for (const filter of filters) {
      if (filter.method !== init?.method) continue;

      if (typeof input === "string" && input.includes(filter.url)) {
        console.log(`Request intercepted`);
        return new Response(filter.responseBody, {
          status: filter.statusCode,
          headers: { "Content-Type": "application/json" },
        });
      } else if (input instanceof URL && input.href.includes(filter.url))
        return new Response(filter.responseBody, {
          status: filter.statusCode,
          headers: { "Content-Type": "application/json" },
        });
      else if (input instanceof Request && input.url.includes(filter.url))
        return new Response(filter.responseBody, {
          status: filter.statusCode,
          headers: { "Content-Type": "application/json" },
        });
    }
    return oldFetch.call(window, input, init);
  };
}

interceptor();

console.log("Running content scripts");
document.body.style.borderTop = "5px solid green";
