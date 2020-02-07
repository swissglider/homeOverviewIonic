import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-tree-element',
  templateUrl: './tree.element.component.html',
  styleUrls: ['./tree.element.component.scss']
})
export class TreeElementComponent implements OnInit {

  @Input('treeData') treeData: {};
  @Output() moreInfoFor = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {}

  isVisible(treeValue:{}):boolean {
    if(!('__visible__' in treeValue)){
      treeValue['__visible__'] = false;
    }
    return treeValue['__visible__'];
  }

  test(tree){
    return true;
  }

  getTreeType(treeKey:string, treeValue:any):string {
    if(treeKey.startsWith('__')){
      if(treeKey === '__visible__'){
        return 'visibleTag';
      }
      if(treeKey === '__info__'){
        // console.log(treeValue)
        return 'infoTag';
      }
      if(treeKey === '__type__'){
        return 'typeTag';
      }
      if(typeof treeValue === 'object'){
        return 'specialFolder';
      }
      else {
        return 'specialValue';
      }
    }
    if(typeof treeValue === 'object'){
      return 'folder';
    }
    return 'value';
  }

  // Order by ascending property value
  keyAscOrder = (a: KeyValue<string,any>, b: KeyValue<string,any>): number => {
    return this.sortKey(a.key, b.key)
  }

  sortKey(a:string, b:string){
    if(a === '__info__') { return -1; }
    if(b === '__info__') { return 1; }
    if(a === '__visible__') { return 1; }
    if(b === '__visible__') { return -1; }
    if(a.startsWith('__') && b.startsWith('__')) { return a > b ? 1: -1; }
    if(a.startsWith('__')) { return -1; }
    if(b.startsWith('__')) { return 1; }
    return a > b ? 1: -1;
  }

  getType(subtree){
    if('__type__' in subtree){
      return subtree.__type__;
    }
    return 'standard';
  }

  getFolderNamePrefix(subtree){
    // if('__type__' in subtree){
    //   return '<<' + subtree.__type__ + '>> ';
    // }
    return '';
  }

  getMoreInfo(key){
    this.moreInfoFor.emit(key);
  }

}