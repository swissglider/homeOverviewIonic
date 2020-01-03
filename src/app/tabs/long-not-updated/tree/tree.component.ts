import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { HelperService } from 'src/app/service/helper.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input('treeData') treeData: {};

  constructor(
    public helperService: HelperService,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
  }

  async presentModal(node) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        'node': node,
      }
    });
    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
      }
    });
    return await modal.present();
  }

  toggleChild(node) {
    if (!('showChildren' in node)) {
      node.showChildren = false;
    }
    node.showChildren = !node.showChildren;
  }

  isNestedType(val: {}): string {
    let counter = {
      nested:0,
      not_nested:0,
    };
    Object.keys(val).forEach(e => {
      e.startsWith('__') ? counter.not_nested++ : counter.nested++;
    });
    if(counter.nested > 0 && counter.not_nested > 0) { return 'mixed'}
    if(counter.nested > 0) { return 'nested'}
    if(counter.not_nested > 0) { return 'not_nested'}
    return 'empty'
    //return (Object.keys(val).reduce((a, c) => (a === 't' || !c.startsWith('__')) ? 't' : 'f', 'f') === 't') ? true : false;
  }

  isTemp(val): boolean {
    return val.startsWith('__')
  }

  getType(val: any, key: string): string {
    if(val === null) { return 'null' }
    if(this.isTemp(key)) { return 'tmp' }
    if(typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') { return 'value' }
    if(typeof val !== 'object') { return 'not object' }
    if(Object.keys(val).length === 0) { return 'empty' }
    return this.isNestedType(val);
  }

  isTime(key): boolean {
    return key === 'ts' || key === 'lc';
  }

  getLocal(value){
    return new Date(value).toLocaleString()
  }

  hasEntries(node: {}): boolean {
    return Object.keys(node).length > 0;
  }

  test(){
    console.log('Hallo');
    return true;
  }

}