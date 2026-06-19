import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

/** Thème FreeGeny — crème + orange, light-only pour l'instant */
export const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      background: "#FFFBF7",
      backgroundHover: "#FFF7ED",
      backgroundPress: "#FFEDD5",
      backgroundFocus: "#FFEDD5",
      color: "#0F172A",
      borderColor: "#FFE4CC",
      borderColorHover: "#FED7AA",
      placeholderColor: "#64748B",
      colorFocus: "#F97316",
      colorPress: "#EA580C",
    },
  },
});

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default tamaguiConfig;
