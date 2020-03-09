import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-test',
    templateUrl: 'test.tab.html',
    changeDetection: ChangeDetectionStrategy.OnPush
  })
  export class TestTab2 implements OnInit {

    public aas: {id:number, value:string}[] = Array.from(Array(100).keys()).map(e => {return {id:e, value:`value is : ${e}`}});
  
    trackById = (index: number, item: any) => item.id;

    constructor(
      public route: ActivatedRoute,
      public router: Router
    ) { }
  
    ngOnInit() {}
  
  }