import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.element.component.scss']
})
export class TreeComponent implements OnInit {

  @Input('treeData') treeData: {};
  @Input('showAgenda') showAgenda?: boolean;
  @Input('withoutAgenda') withoutAgenda?: boolean;
  @Output() moreInfoFor = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    if(this.showAgenda === undefined){
        this.showAgenda = true;
    }
    if(this.withoutAgenda === undefined){
        this.withoutAgenda = false;
    }
  }

  getMoreInfo(key){
    this.moreInfoFor.emit(key);
  }

}