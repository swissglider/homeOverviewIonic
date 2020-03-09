import { Injectable } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { HelperService } from './helper.service';
import { PageDeclarations, MenuDeclarations } from '../declaration/page.declaration';
import { IconsService } from './icons.service';
import { MenuModel, MenuEntryModel, MenuFolderModel } from '../modules/menu/menu.model';



@Injectable({
  providedIn: 'root'
})
export class PageService {
  private currentPath = '/tabs/tab-lights';
  private previousPath: string;

  constructor(
    private router: Router,
    private helperService: HelperService,
    public iconsService: IconsService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        if (this.currentPath !== event.url) {
          this.previousPath = this.currentPath
          this.currentPath = event.url;
        }
      }
    });
  }

  getCurrentPageDeclaration(): {} {
    let tmpPageDecl = Object.values(PageDeclarations).filter(e => e.fullPath === this.currentPath);
    if (tmpPageDecl.length === 0) {
      const t = Object.values(PageDeclarations).filter(e => 'redirect' in e);
      tmpPageDecl = Object.values(t).filter(e => e['redirect'].includes(this.currentPath));
    }
    return tmpPageDecl[0];
  }
  getCurrentPageID(): string {
    let tmpPageDecl = Object.entries(PageDeclarations).filter(([key, val]) => val.fullPath === this.currentPath).map(([key, val]) => key);
    if (tmpPageDecl.length === 0) {
      const t = Object.entries(PageDeclarations).filter(([key, val]) => 'redirect' in val);
      tmpPageDecl = t.filter(([key, val]) => val['redirect'].includes(this.currentPath)).map(([key, val]) => key);
    }
    return tmpPageDecl[0];
  }
  getCurrentPageName(): string {
    try {
      return this.helperService.getByLanguage(this.getCurrentPageDeclaration()['name']);
    } catch (error) {
      return '';
    }
  }
  getCurrentPageIcon(): string {
    try {
      return this.getCurrentPageDeclaration()['tabIcon'];
    } catch (error) {
    }
  }
  getCurrentPath(): string {
    return this.currentPath
  }
  getPreviousPath(): string {
    return this.previousPath;
  }
  navigate(uri: string) {
    const pQM = uri.indexOf('?');
    if (pQM === -1) {
      this.router.navigate([uri]);
      return;
    }
    const url = uri.substr(0, uri.indexOf('?'));
    const paramStr = uri.substring(uri.indexOf('?') + 1);
    var params = {};
    const paramsArray = paramStr.split('&');
    for (var i = 0; i < paramsArray.length; i++) {
      var pair = paramsArray[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    this.router.navigate([url], { queryParams: params })
  }

  navigateBack() {
    this.navigate(this.getPreviousPath());
  }

  getStandardIcon() {
    return this.getCurrentPageIcon();
  }

  getActiveMenuModel(): MenuModel {
    var tmpMenuModule: MenuModel = {
      activeID: this.getCurrentPageID(),
      name: this.getCurrentPageName(),
      activeIcon: this.getStandardIcon(),
      defaultOpen: true,
      menuIcon: this.iconsService.getIcon('menu', 'default', '20'),
    }
    var tmpMenuModule: MenuModel = {
      activeID: this.getCurrentPageID(),
      name: this.getCurrentPageName(),
      activeIcon: this.getStandardIcon(),
      defaultOpen: true,
      menuIcon: this.iconsService.getIcon('menu', 'default', '20'),
    }
    tmpMenuModule.folders = [];
    MenuDeclarations.forEach(e => {
      let tmpFolder: MenuFolderModel = {
        menuID: e.menuID,
        name: this.helperService.getByLanguage(e.menuName),
        defaultOpen: true,
      }
      tmpFolder.entries = Object.entries(PageDeclarations)
        .filter(([key, val]) => val['menuID'] === e.menuID)
        .map(([key, val]) => {
          return <MenuEntryModel>{
            id: key,
            name: this.helperService.getByLanguage(val.name),
            icon: val.tabIcon,
            order: val.order,
            path: val.fullPath,
          }
      });
      tmpMenuModule.folders.push(tmpFolder);
    });

    tmpMenuModule.entries = [
      {
        id: 'home',
        name: 'Home',
        order: 0,
        icon: this.iconsService.getIcon('home', 'default', '20'),
        path: '/'
      }
    ]

    return tmpMenuModule;
  }

}