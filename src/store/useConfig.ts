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

export type ConfigKey = string;
export type Config = {
  key: ConfigKey;
  url: string;
  method: string;
  statusCode: number;
  responseBody?: string;
};
type Configs = Record<ConfigKey, Config>;

export const useConfig = create<{
  configs: Configs;
  init: () => void;
  updateConfig: (conf: Config) => void;
  addConfig: (conf: Config) => void;
  removeConfig: (conf: Config) => void;
}>((set) => ({
  configs: {
    initial: {
      key: "initial",
      url: "",
      method: "GET",
      statusCode: 200,
      responseBody: "{}",
    },
  },
  init: async () => {
    const result = await appStorage.get<Configs>("config");
    if (!result) return;
    set({
      configs: result,
    });
  },
  updateConfig: async (conf: Config) => {
    set((state) => ({
      configs: {
        ...state.configs,
        [conf.key]: conf,
      },
    }));
  },
  addConfig: async (conf: Config) => {
    set((state) => ({
      configs: {
        ...state.configs,
        [conf.key]: conf,
      },
    }));
  },
  removeConfig: async (conf: Config) => {
    set((state) => ({
      configs: {
        ...state.configs,
        [conf.key]: conf,
      },
    }));
  },
}));

useConfig.getState().init();

useConfig.subscribe((state) => {
  console.log(`Updating state: ${JSON.stringify(state)}`);
  appStorage.set("config", state.configs);
});
