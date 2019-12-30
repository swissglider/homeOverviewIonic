import { Injectable } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { HelperService } from './helper.service';
import { PageDeclarations } from '../declaration/page.declaration';



@Injectable({
  providedIn: 'root'
})
export class PageService {

  private currentPath = '/tabs/tab-lights';
  private previousPath: string;

  constructor(
    private router: Router,
    private helperService: HelperService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url){
        if(this.currentPath !== event.url){
          this.previousPath = this.currentPath
          this.currentPath = event.url;
        }
      }
    });
  }

  getCurrentPageDeclaration(): {} {
    let tmpPageDecl = Object.values(PageDeclarations).filter(e => e.fullPath === this.currentPath);
    // if(tmpPageDecl.length === 0){
    //   routes.forEach(root => {
    //     if('children' in root){
    //       root.children.forEach(route => {
    //         if('redirectTo' in route && route.redirectTo === this.currentPath){
    //           this.currentPath = route.path;
    //         }
    //       });
    //     }
    //   });
    //   tmpPageDecl = Object.values(PageDeclarations.pages).filter(e => e.path === this.currentPath);
    // }
    return tmpPageDecl[0];
  }
  getCurrentPageName(): string {
    try {
      return this.helperService.getByLanguage(this.getCurrentPageDeclaration()['name']);
    } catch (error) {
      console.error(error);
      console.error(this.router.url);
    }
  }
  getCurrentPageIcon(): string {
    try {
      return this.getCurrentPageDeclaration()['tabIcon'];
    } catch (error) {
    }
  }
  getCurrentPath():string{
    return this.currentPath
  }
  getPreviousPath():string{
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

  navigateBack(){
    this.navigate(this.getPreviousPath());
  }

}