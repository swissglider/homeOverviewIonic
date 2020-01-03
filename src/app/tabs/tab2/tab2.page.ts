import { Component } from '@angular/core';
import { PageService } from 'src/app/service/page.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    public pageService:PageService,
  ) {}

}
