import { Component, Input} from '@angular/core';
import { HelperService } from '../../../service/helper.service';
import { PageService } from '../../../service/page.service'
import { Router } from '@angular/router';
import { IconsService } from 'src/app/service/icons.service';


@Component({
  selector: 'app-menu-bar',
  templateUrl: 'menu-bar.component.html',
  styleUrls: ['menu-bar.component.scss']
})
export class MenuBarComponent {

  constructor(
    public helperService:HelperService,
    public pageService:PageService,
    private router: Router,
    public iconsService: IconsService,
  ) {}

  showTest(){
    this.pageService.getCurrentPageDeclaration();
  }

  openMenu(){
    this.router.navigate(['/tabs/menu'])
  }

}