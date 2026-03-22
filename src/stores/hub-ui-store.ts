import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HubThemePreference = "light" | "dark" | "system";

type HubUiState = {
  theme: HubThemePreference;
  setTheme: (t: HubThemePreference) => void;
  /** Desktop: hide fixed left nav for a wider content column (mobile uses top menu). */
  sidebarCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  agencyOpen: boolean;
  openAgency: (source?: string) => void;
  closeAgency: () => void;
  lastAgencySource: string | null;
};

export const useHubUi = create<HubUiState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
      sidebarCollapsed: false,
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      agencyOpen: false,
      openAgency: (source) =>
        set({ agencyOpen: true, lastAgencySource: source ?? "sidebar" }),
      closeAgency: () => set({ agencyOpen: false }),
      lastAgencySource: null,
    }),
    {
      name: "torq-hub-ui",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    },
  ),
);
