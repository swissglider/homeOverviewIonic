import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputButtons } from '../../components/menu/menu.model';

@Component({
    selector: 'app-test',
    templateUrl: 'test.tab.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class TestTab implements OnInit {

    public aas: {id:number, value:string}[] = Array.from(Array(100).keys()).map(e => {return {id:e, value:`value is : ${e}`}});
  
    trackById = (index: number, item: any) => item.id;

    buttons: InputButtons = {
      buttons : [{
        buttonID: 'qq',
        showText: 'Hallo Test',
        value: true
      }]
    }

    constructor(
      public route: ActivatedRoute,
      public router: Router
    ) { 
    }
  
    ngOnInit() {}

    buttonReturn($event){
      console.log($event)
    }
  
  }