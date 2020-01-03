import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input('treeData') treeData: {};

  constructor(
  ) { }

  ngOnInit() {
    // console.log(this.treeData)
  }

  isVisible(treeValue:{}):boolean {
    if(!('__visible__' in treeValue)){
      treeValue['__visible__'] = false;
      return false
    }
    return treeValue['__visible__'];
  }

  getTreeType(treeKey:string, treeValue:any):string {
    if(treeKey.startsWith('__')){
      if(treeKey === '__visible__'){
        return 'visibleTag';
      }
      if(treeKey === '__info__'){
        console.log(treeValue)
        return 'infoTag';
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

}