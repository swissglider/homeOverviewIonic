

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
    order: 7,
    name: {
      en: "Wrong Enum Entry",
      de: "Falsche Enum Einträge",
    },
    path: 'wrong-enum-entry',
    asTab: false,
    tabIcon: "wrong-entry",
    fullPath: "/tabs/wrong-enum-entry",
    menuID: 'advanced',
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
    menuID: 'advanced',
    menuName: {
      en: 'Advanced Sites',
      de: 'Experten Seiten'
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