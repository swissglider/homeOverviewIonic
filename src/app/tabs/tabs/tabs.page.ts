import { Component } from '@angular/core';
import { IconsService } from '../../service/icons.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    public iconsService: IconsService,
  ) {}

}
