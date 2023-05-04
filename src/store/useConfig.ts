import { create } from "zustand";

type StorageArea = chrome.storage.StorageArea;

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

type Config = {
  url: string;
  method: string;
  statusCode: number;
  responseBody?: string;
};

export const useConfig = create<{
  config: Config;
  init: () => void;
  updateConfig: (conf: Config) => void;
}>((set) => ({
  config: {
    url: "",
    method: "GET",
    statusCode: 200,
    responseBody: "{}",
  },
  init: async () => {
    const result = await appStorage.get<Config>("config");
    set({ config: result || undefined });
  },
  updateConfig: async (conf: Config) => {
    set({ config: conf });
    await appStorage.set("config", conf);
  },
}));

useConfig.getState().init();

useConfig.subscribe((state) => {
  useConfig.getState().updateConfig(state.config);
});
