import { defineStore } from "pinia";

interface BreadcrumbItem {
  label: string;
  to?: string;
  icon?: string;
}

interface AdminLayoutState {
  sidebarVisible: boolean;
  sidebarCollapsed: boolean;
  darkMode: boolean;
  breadcrumbs: BreadcrumbItem[];
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  mobileMenuActive: boolean;
  menuHoverActive: boolean;
}

export const useAdminLayoutStore = defineStore("adminLayout", {
  state: (): AdminLayoutState => ({
    sidebarVisible: true,
    sidebarCollapsed: false,
    darkMode: false,
    breadcrumbs: [],
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    mobileMenuActive: false,
    menuHoverActive: false,
  }),

  getters: {
    isSidebarVisible: (state) => state.sidebarVisible,
    isDarkMode: (state) => state.darkMode,
    containerClass: (state) => {
      return {
        "layout-static": true,
        "layout-static-inactive": state.staticMenuDesktopInactive,
        "layout-overlay-active": state.overlayMenuActive,
        "layout-mobile-active": state.mobileMenuActive,
        "layout-dark": state.darkMode,
        "layout-light": !state.darkMode,
      };
    },
  },

  actions: {
    toggleSidebar() {
      if (window.innerWidth > 991) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }
    },

    hideSidebar() {
      this.mobileMenuActive = false;
      this.overlayMenuActive = false;
    },

    toggleDarkMode() {
      this.darkMode = !this.darkMode;
      this.saveDarkModePreference();
      this.applyDarkMode();
    },

    setDarkMode(value: boolean) {
      this.darkMode = value;
      this.applyDarkMode();
    },

    applyDarkMode() {
      if (this.darkMode) {
        document.documentElement.classList.add("admin-dark");
        document.documentElement.classList.remove("admin-light");
      } else {
        document.documentElement.classList.add("admin-light");
        document.documentElement.classList.remove("admin-dark");
      }
    },

    saveDarkModePreference() {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("admin-dark-mode", String(this.darkMode));
      }
    },

    loadDarkModePreference() {
      if (typeof localStorage !== "undefined") {
        const saved = localStorage.getItem("admin-dark-mode");
        if (saved !== null) {
          this.darkMode = saved === "true";
          this.applyDarkMode();
        } else {
          // Check system preference
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          this.darkMode = prefersDark;
          this.applyDarkMode();
        }
      }
    },

    setBreadcrumbs(items: BreadcrumbItem[]) {
      this.breadcrumbs = items;
    },

    onMenuToggle() {
      if (window.innerWidth > 991) {
        this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
      } else {
        this.mobileMenuActive = !this.mobileMenuActive;
      }
    },

    onSidebarClick() {
      this.menuHoverActive = true;
    },

    onMenuItemClick(event: { originalEvent: Event; item: any }) {
      if (!event.item.items) {
        this.overlayMenuActive = false;
        this.mobileMenuActive = false;
      }
    },
  },
});
