

export let PageDeclarations = {
  tabLightsPage: {
    order: 1,
    name: {
      en: "All Lights",
      de: "Alle Lichter",
    },
    path: 'tab-lights',
    asTab: true,
    tabIcon: "light",
    fullPath: "/tabs/tab-lights",
    redirect: ['/tabs/tab-functions?function=enum.functions.light', '/'],
    menuID: 'function',
  },
  doors: {
    order: 2,
    name: {
      en: "All Doors",
      de: "Alle Türen",
    },
    path: 'tab-doors',
    asTab: true,
    tabIcon: "doors",
    fullPath: "/tabs/tab-doors",
    redirect: '/tabs/tab-functions?function=enum.functions.doors',
    menuID: 'function',
  },
  windows: {
    order: 3,
    name: {
      en: "All Windows",
      de: "Alle Fenster",
    },
    path: 'tab-windows',
    asTab: true,
    tabIcon: "window",
    fullPath: "/tabs/tab-windows",
    redirect: '/tabs/tab-functions?function=enum.functions.window',
    menuID: 'function',
  },
  tab1: {
    order: 4,
    name: {
      en: "Tab 1",
      de: "Tab 1",
    },
    path: 'tab1',
    asTab: true,
    tabIcon: "flash",
    fullPath: "/tabs/tab1",
    menuID: 'test',
  },
  tab2: {
    order: 5,
    name: {
      en: "Tab 2",
      de: "Tab 2",
    },
    path: 'tab2',
    asTab: false,
    tabIcon: "apps",
    fullPath: "/tabs/tab2",
    menuID: 'test',

  },
  tab3: {
    order: 6,
    name: {
      en: "Tab 3",
      de: "Tab 3",
    },
    path: 'tab3',
    asTab: true,
    tabIcon: "send",
    fullPath: "/tabs/tab3",
    menuID: 'test',
  },
  menu: {
    order: 7,
    name: {
      en: "Overview",
      de: "Übersicht",
    },
    path: 'menu',
    asTab: false,
    tabIcon: "menu",
    fullPath: "/tabs/menu",
  },
  wrongEnumEntry: {
    order: 8,
    name: {
      en: "Wrong Enum Entry",
      de: "Falsche Enum Einträge",
    },
    path: 'wrong-enum-entry',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/wrong-enum-entry",
    menuID: 'maintenance',
  },
  longNotUpdated: {
    order: 9,
    name: {
      en: "Long time not updated",
      de: "Lange nicht aktualisiert",
    },
    path: 'long-not-updated',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/long-not-updated",
    menuID: 'maintenance',
  },
  functions: {
    order: 9,
    name: {
      en: "Functions",
      de: "Functions",
    },
    path: 'functions',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/functions",
    menuID: 'test',
  },
  overview: {
    order: 9,
    name: {
      de: "Übersicht",
      en: "Overview",
    },
    path: 'overview',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/overview",
    menuID: 'test',
  },
  overview_compact: {
    order: 9,
    name: {
      de: "Übersicht Compact",
      en: "Overview compact",
    },
    path: 'overview_compact',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/overview_compact",
    menuID: 'test',
  }
};

export const MenuDeclarations = [
  {
    menuID: 'general',
    menuName: {
      en: 'General',
      de: 'Generell'
    },
    defaultOpen: true,
  },
  {
    menuID: 'function',
    menuName: {
      en: 'Functional Sites',
      de: 'Funktions Seiten'
    },
    defaultOpen: true,
  },
  {
    menuID: 'maintenance',
    menuName: {
      en: 'Maintenance Sites',
      de: 'Wartungs Seiten'
    },
    defaultOpen: false,
  },
  {
    menuID: 'test',
    menuName: {
      en: 'Test Sites',
      de: 'Test Seiten'
    },
    defaultOpen: false,
  }
]