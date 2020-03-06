export interface ComponentDataModel {
    componentName:string;
    ordre: number;
    title: string;
    icon: string;
}

export interface ComponentModel {
    path: string;
    moduleName: string;
    data: ComponentDataModel;
}

export interface LayoutModel {
    apps: Array<ComponentModel>;
}