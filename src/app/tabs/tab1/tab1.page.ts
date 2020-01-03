import { Component } from '@angular/core';
import { PageService } from 'src/app/service/page.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    public pageService:PageService,
  ) {}

}
