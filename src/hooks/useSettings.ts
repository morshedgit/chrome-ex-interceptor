import { create } from "zustand";
import { getInjectedScripts } from "../services/chrome";

type Setting = string;

type Settings = {
  setting: Setting[];
};

export const useSettings = create<Settings>((set) => ({
  setting: [],
}));

getInjectedScripts({}).then((scripts) =>
  useSettings.setState({ setting: scripts.map((s) => s.id) })
);
