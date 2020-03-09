export interface MenuModel {
    activeID: string;
    name: string;
    activeIcon: string;
    menuIcon: string;
    defaultOpen: boolean;
    folders?: Array<MenuFolderModel>;
    entries?: Array<MenuEntryModel>;
}

export interface MenuEntryModel {
    id: string;
    name: string;
    icon?: string;
    order: number;
    path: string;
}

export interface MenuFolderModel {
    menuID: string;
    name: string;
    folderIcon?: string;
    defaultOpen: boolean;
    folders?: Array<MenuFolderModel>;
    entries?: Array<MenuEntryModel>;
}