import { Injectable, Inject } from '@angular/core';
import { ErrorMsg, ErrorMsgSeverity } from './error-msg.model';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/homeoverview/_global/services/data.service/data-service';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

/** Error Msg State */
export interface ErrorMsgState extends EntityState<ErrorMsg, string> { }

/** Error Msg Store.. all the Errors/Exceptions has to be send to the store */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'ErrorMsgState' })
export class ErrorMsgStore extends EntityStore<ErrorMsgState> {

  private logLevel: number;
  private subscriptions: Subscription[] = []

  /** @ignore */
  constructor(
    private activeRoute: ActivatedRoute,
    @Inject(DataService) protected _service: DataService,
  ) {
    super();
    this.akitaPreAddEntity = this.akitaPreAddEntity.bind(this);
    this.addNewErrorMsg = this.addNewErrorMsg.bind(this);
    let subj$ = <Observable<any>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
    this.subscriptions.push(subj$.subscribe(e => {
      this.logLevel = e.general.logLevel;
    }));
  }

  akitaPreAddEntity(errorMsg: ErrorMsg): ErrorMsg {
    if (!errorMsg.severity || errorMsg.severity < this.logLevel) { return null };
    errorMsg.id = this.RID();
    errorMsg.timestamp = new Date().getTime();
    switch (errorMsg.severity) {
      case ErrorMsgSeverity.INFO || ErrorMsgSeverity.LOG:
        errorMsg.color = (errorMsg.color) ? errorMsg.color : 'primary';
        errorMsg.icon = (errorMsg.icon) ? errorMsg.icon : 'information-sharp';
        break;
      case ErrorMsgSeverity.SUCCESS:
        errorMsg.color = (errorMsg.color) ? errorMsg.color : 'success';
        errorMsg.icon = (errorMsg.icon) ? errorMsg.icon : 'checkmark-circle-sharp';
        break;
      case ErrorMsgSeverity.WARN:
        errorMsg.color = (errorMsg.color) ? errorMsg.color : 'warning';
        errorMsg.icon = (errorMsg.icon) ? errorMsg.icon : 'warning-sharp'
        break;
      default:
        errorMsg.color = (errorMsg.color) ? errorMsg.color : 'danger';
        errorMsg.icon = (errorMsg.icon) ? errorMsg.icon : 'alert-sharp';
    }
    if (!errorMsg.errorcode) { errorMsg.errorcode = '?' }
    return errorMsg;
  }

  /**
   * get Random ID for ErrorStore handling
   *
   * @returns {string} randomID
   */
  public RID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  addNewErrorMsg(errorMsg: ErrorMsg) {
    if(!errorMsg || !errorMsg.severity || errorMsg.severity < this.logLevel) { return }
    this.add(errorMsg);
  }

}

