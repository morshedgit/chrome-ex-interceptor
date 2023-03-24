import { create } from "zustand";

type Config = {
  url: string;
  method: string;
  statusCode: number;
  responseBody: string;
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
  init: () => {
    chrome.storage.local.get("config", (result) => {
      set({ config: result.config || {} });
    });
  },
  updateConfig: (conf: Config) =>
    set({
      config: conf,
    }),
}));

useConfig.getState().init();

useConfig.subscribe((state) => {
  chrome.storage.local.set({ config: state.config });
});
