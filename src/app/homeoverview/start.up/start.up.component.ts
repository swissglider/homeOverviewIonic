import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewEncapsulation, ElementRef } from '@angular/core';
import { TestService } from '../app/services/test.service/test.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-start-up',
  templateUrl: 'start.up.component.html',
  styleUrls: ['start.up.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None
})
export class StartUpComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  finished:boolean = false;
  orgBodyBgrColor = '';

  constructor(
    private router: Router,
    public testService: TestService,
    private elementRef: ElementRef,
    private navCtrl: NavController,
  ) {
    this.subscription = this.testService.isFinished().subscribe({
      next: x => {
        this.finished = x;
        if(this.finished){
          this.navCtrl.navigateForward('/app', {animated: false}).then(()=>{
              this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.orgBodyBgrColor;
            });
        }
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {},
    });
  }

  ionViewWillEnter(){
    // if(this.finished){
    //   this.navCtrl.navigateForward('/app', {animated: false}).then(()=>{
    //     this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = this.orgBodyBgrColor;
    //   });
    // }
  }

  ngOnInit(): void { }

  ngAfterViewInit(){
    this.orgBodyBgrColor = this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'green';
 }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}