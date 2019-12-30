import { Component } from '@angular/core';
import { IconsService } from '../../service/icons.service';
import { HelperService } from '../../service/helper.service';
import { Router, RouterEvent } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PageDeclarations } from 'src/app/declaration/page.declaration';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  public pages = Object.values(PageDeclarations);
  selectedPath = '';

  constructor(
    public iconsService: IconsService,
    public helperService: HelperService,
    private router: Router,
    public navCtrl: NavController
  ) {
    this.pages.sort((a,b) => a.order-b.order);
    this.router.events.subscribe((event: RouterEvent) => {
      if(event && event.url){
        this.selectedPath = event.url;
      }
    });
  }

}
