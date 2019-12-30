import { Component } from '@angular/core';
import { PageService } from 'src/app/service/page.service';
import { HelperService } from 'src/app/service/helper.service';
import { IconsService } from 'src/app/service/icons.service';
import { PageDeclarations, MenuDeclarations } from 'src/app/declaration/page.declaration';

@Component({
    selector: 'app-menu-page',
    templateUrl: 'menu.page.html',
    styleUrls: ['menu.page.scss']
})
export class MenuPage {

    private pages = Object.values(PageDeclarations);
    private menu = MenuDeclarations;

    public menuStructs = []

    constructor(
        public helperService: HelperService,
        private pageService: PageService,
        public iconsService: IconsService,
    ) { }

    /** @ignore */
    ngOnInit(): void {
    }

    /** @ignore */
    ionViewWillEnter(): void {
        this.menuStructs = [];
        this.menu.forEach(mEntry => {
            let tmpStruct = {};
            tmpStruct['menuEntry'] = mEntry;
            tmpStruct['values'] = this.pages.filter(e => e['menuID'] === mEntry.menuID);
            this.menuStructs.push(tmpStruct);
        });
    }

    back() {
        this.pageService.navigateBack();
    }

    openPage(uri) {
        this.pageService.navigate(uri);
    }

    getLastPage() {
        return this.pageService.getPreviousPath();
    }
}