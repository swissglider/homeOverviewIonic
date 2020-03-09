import { Component, OnInit, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { MenuModel, MenuFolderModel } from '../menu.model';

@Component({
  selector: 'app-menu-tree',
  templateUrl: './menu.tree.component.html',
  styleUrls: ['./menu.tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuTreeComponent implements OnInit {

  @Input('menuData') treeData: MenuModel | MenuFolderModel;
  @Input('level') level: number;
  @Input('activeID') activeID: string = '';

  @Output() navigateTo = new EventEmitter<string>();

  padding_left: string = '0em';
  entry_pedding_left: string = '0em';

  constructor() { }

  ngOnInit() {
    if('activeID' in this.treeData){
      this.activeID = this.treeData.activeID;
    }
    this.padding_left = (this.level - 1).toString() + 'em';
    this.entry_pedding_left = (this.level).toString() + 'em';
  }

  hasFolders(struct: MenuModel | MenuFolderModel): boolean {
    return struct && 'folders' in struct && struct.folders.length > 0
  }

  hasEntries(struct: MenuModel | MenuFolderModel): boolean {
    return struct && 'entries' in struct && struct.entries.length > 0
  }

  navigate(path){
    this.navigateTo.emit(path);
  }

}