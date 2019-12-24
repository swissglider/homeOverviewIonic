import {
  Injectable
} from '@angular/core';
import { IoBStateStore } from '../store/state/io-bstate.store';
import { IoBObjectStore } from '../store/object/io-bobject.store';
import {
  EntityActions
} from '@datorama/akita';
import { ErrorMsgStore } from '../store/error/error-msg.store';

import io from 'socket.io-client';
import { NewIOBStateQuery } from '../store/newstate/new-iobstate.query';
import { ErrorMsgQuery } from '../store/error/error-msg.query';
import { IoBEnumStore } from '../store/enum/io-benum.store';
import { IoBEnumQuery } from '../store/enum/io-benum.query';
import { Observable, of, Observer, Subject, BehaviorSubject } from 'rxjs';

/** ioBroker adapter namespace */
const namespace = 'homeOverview.0';
/** ioBroker url */
const url = 'http://localhost:8082'; // user in app.module to connect the socket
/** socket.io connection configuration */
const socketConfig = {
  query: 'key=',
  reconnectionDelay: 10000, // org 10000
  reconnectionAttempts: Infinity,
  reconnection: true,
  forceNew: true,
  transports: ['websocket']
};

/** socket */
const socket = io.connect(url, socketConfig);

/**
 * The IOBrokerService is responsible for creating the IoBStates and IoBObjects.
 * The Base is the ioBroker socket.io Adapter that send the new States via socket.io
 */
@Injectable({
  providedIn: 'root'
})
export class IOBrokerService {

  /** [states, objects, enums] */
  // tslint:disable-next-line: variable-name
  private _loaded = {
    states: false,
    objects: false,
    enums: false
  };
  private _isLoaded = false;
  private _loaded$ = new BehaviorSubject(false);

  /** if all are loaded it returns true (ioBroker Objects, Enums and States) */
  public get loaded(): boolean {
    return this._isLoaded;
  }

  public selectLoaded(): Observable<boolean> {
    return this._loaded$;
  }

  /** @ignore */
  public set loaded(conn: boolean) {}

  /** sets one pice for loading (if one of Objects, Enums or States are loaded) */
  private setLoaded(name: string, value: boolean) {
    if (name in this._loaded) {
      this._loaded[name] = value;
    }
    if (this.loaded) {
      this.ioBobjectStore.setLoading(false);
      this.ioBstateStore.setLoading(false);
    } else {
      this.ioBobjectStore.setLoading(true);
      this.ioBstateStore.setLoading(true);
    }
    this._isLoaded = Object.values(this._loaded).every(elem => elem === true);
    this._loaded$.next(this._isLoaded);
  }

  /** @ignore */
  constructor(
    private ioBstateStore: IoBStateStore,
    private ioBobjectStore: IoBObjectStore,
    private ioBenumStore: IoBEnumStore,
    private newIOBStateQuery: NewIOBStateQuery,
    private ioBenumQuery: IoBEnumQuery,
    private errorMsgQuery: ErrorMsgQuery,
    private errorMsgStore: ErrorMsgStore,
  ) {}

  /** this initiate the connection to the ioBroker and has only to be called from the app.component */
  public init() {
    this.connect();

    /** Listen to updates on the NewIOBStateStore */
    this.newIOBStateQuery.selectEntityAction().subscribe(action => {
      // tslint:disable-next-line: no-shadowed-variable
      const setNewState = (action) => {
        action.ids.forEach((id) => {
          if (this.newIOBStateQuery.hasEntity(id)) {
            const entity = this.newIOBStateQuery.getEntity(id);
            if ('val' in entity && entity.val !== null) {
              this.setState(id, entity.val);
            }
          }
        });
      };

      switch (action.type) {
        case EntityActions.Add:
          setNewState(action);
          break;
        case EntityActions.Remove:
          break;
        case EntityActions.Set:
          setNewState(action);
          break;
        case EntityActions.Update:
          setNewState(action);
          break;
      }
    });

    /** Listen for Errors to logg */
    this.errorMsgQuery.selectEntityAction().subscribe(action => {
      action.ids.forEach((id) => {
        if (this.errorMsgQuery.hasEntity(id)) {
          const entity = this.errorMsgQuery.getEntity(id);
          // <-- ToDo --> Log to ioBroker but do not know how ??
        }
      });
    });
  }

  /** @ignore */
  private connect() {

    socket.on('log', (obj) => {
      console.log('-------------- LOG --------------');
      console.log(obj);
    });

    socket.on('connect', () => {
      const that = this;
      console.log('=> connecting...');
      console.log('Socket ID :' + socket.id);
      console.log('Socket Connected: ' + socket.connected);
      console.log('Socket Disconnected: ' + socket.disconnected);
      socket.emit('name', namespace, () => {
        setTimeout(() => {
          const wait = setTimeout(() => {
            const msg: string = 'No answer from server';
            const act: string = 'Please relaod site';
            this.errorMsgStore.add({
              id: this.RID(),
              type: 'danger',
              text: msg,
              action: act,
              scope: 'global'
            });
          }, 3000);
          socket.emit('authenticate', (isOk, isSecure) => {
            clearTimeout(wait);
            if (isOk) {
              socket.emit('getStates', '*', (err, data) => {
                if (err) {
                  const msg: string = 'getStates Error: ' + err;
                  const act: string = 'Try again the last task';
                  this.errorMsgStore.add({
                    id: this.RID(),
                    type: 'danger',
                    text: msg,
                    action: act,
                    scope: 'global'
                  });
                }
                if (data) {
                  const datas = [];
                  for (const id in data) {
                    if (data.hasOwnProperty(id)) {
                      let tmp = data[id];
                      if (tmp === null) {
                        tmp = {};
                      }
                      tmp.id = id;
                      datas.push(tmp);
                    }
                  }
                  this.ioBstateStore.upsertMany(datas);
                }
                socket.emit('subscribe', '*', () => {
                  this.setLoaded('states', true);
                });
              });
              socket.emit('getObjects', (err, data) => {
                if (err) {
                  const msg: string = 'getObjects Error: ' + err;
                  const act: string = 'Try again the last task';
                  this.errorMsgStore.add({
                    id: this.RID(),
                    type: 'danger',
                    text: msg,
                    action: act,
                    scope: 'global'
                  });
                }
                if (data) {
                  this.ioBobjectStore.upsertMany(Object.values(data));
                }
                socket.emit('subscribeObjects', '*', () => {
                  this.setLoaded('objects', true);
                });
              });
              socket.emit('getObjectView', 'system', 'device', {
                startkey: '',
                endkey: '' + '\u9999'
              }, (err, data) => {
                if (data) {
                  this.ioBobjectStore.upsertMany(data.rows.map(x => x.value));
                }
              });
              socket.emit('getObjectView', 'system', 'channel', {
                startkey: '',
                endkey: '' + '\u9999'
              }, (err, data) => {
                if (data) {
                  this.ioBobjectStore.upsertMany(data.rows.map(x => x.value));
                }
              });
              socket.emit('getObjectView', 'system', 'enum', {
                startkey: 'enum',
                endkey: 'enum' + '\u9999'
              }, (err, data) => {
                if (err) {
                  const msg: string = 'getEnum Error: ' + err;
                  const act: string = 'Try again the last task';
                  this.errorMsgStore.add({
                    id: this.RID(),
                    type: 'danger',
                    text: msg,
                    action: act,
                    scope: 'global'
                  });
                }
                if (data) {
                  const datas = [];
                  for (const id in Object.values(data.rows)) {
                    if (Object.values(data.rows).hasOwnProperty(id)) {
                      // tslint:disable-next-line: no-string-literal
                      let value = Object.values(data.rows)[id]['value'];
                      value['id'] = value._id;
                      let newMembers = []
                      value.common.members.forEach((member:string) => {
                        if(member.startsWith('enum.')){
                          let tempData = data.rows.filter(e => e.id === member);
                          if(tempData.length > 0) {
                            newMembers = newMembers.concat(tempData[0].value.common.members)
                          }
                        } else {
                          newMembers.push(member)
                        }
                      })
                      value.common.allMembers = newMembers;
                      datas.push(value);
                    }
                  }
                  this.ioBenumStore.upsertMany(datas);
                }
                this.setLoaded('enums', true);
              });
              socket.emit('authEnabled', (authEnabled, currentUser) => {
                // --> user into ioBroker store
                // --> set connected to true
              });
            } else {
              const msg: string = 'permissionError';
              const act: string = 'Reload Site';
              this.errorMsgStore.add({
                id: this.RID(),
                type: 'danger',
                text: msg,
                action: act,
                scope: 'global'
              });
            }
          });
        }, 50);
      });
    });

    socket.on('connect_error', (error) => {
      const msg: string = '!! connection_Error :' + error;
      const act: string = 'Reload Site';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('connect_timeout', (timeout) => {
      const msg: string = '!! connect_timeout :' + timeout;
      const act: string = 'Reload Site';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('error', (error) => {
      const msg: string = '!! error :' + error;
      const act: string = 'Unexpected, do not know how to help';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('disconnect', (reason) => {
      const msg: string = '!! Disconnected Reason:' + reason;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reconnect', (attemptNumber) => {
      const msg: string = '!! Reconnected attempt number:' + attemptNumber;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      const msg: string = '!! Reconnected attempt number:' + attemptNumber;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reconnecting', (attemptNumber) => {
      const msg: string = '!! Reconnected attempt number:' + attemptNumber;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reconnect_error', (error) => {
      const msg: string = '!! reconnect_error :' + error;
      const act: string = 'Reload Site';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reconnect_failed', () => {
      const msg: string = '!! reconnect_failed';
      const act: string = 'Reload Site';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('objectChange', (id, obj) => {
      if (this.loaded) {
        if(obj && 'type' in obj && obj.type === 'enum'){
          if (obj === null) {
            this.ioBenumStore.remove(id);
          } else {
            let newMembers = []
            obj.common.members.forEach((member:string) => {
              if(member.startsWith('enum.')){
                let tempData = this.ioBenumQuery.getMembersPerEntity(member);
                if(tempData.length > 0) {
                  newMembers = newMembers.concat(tempData)
                }
              } else {
                newMembers.push(member)
              }
            });
            try{
              obj.common.allMembers = newMembers;
              this.ioBenumStore.upsert(id, obj);
            }catch(e){}
          }
        }
        else {
          if (obj === null) {
            this.ioBobjectStore.remove(id);
          } else {
            this.ioBobjectStore.upsert(id, obj);
          }
        }
      }
    });

    socket.on('stateChange', (id, state) => {
      if (this.loaded) {
        state.id = id;
        this.ioBstateStore.upsert(id, state);
      }
    });

    socket.on('permissionError', (error) => {
      const msg: string = '!! permissionError :' + error;
      const act: string = 'Reload Site';
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'danger',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('reauthenticate', () => {
      const msg: string = '!! reauthenticate';
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('eventsThreshold', (hasThreshold) => {
      const msg: string = '!! eventsThreshold: ' + hasThreshold;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('type', (id, obj) => {
      const msg: string = 'Type id: ' + id + ' - obj: ' + obj;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('cmd', (id, data) => {
      const msg: string = 'CMD id: ' + id + ' - data: ' + data;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('connectWait', (delaySeconds) => {
      const msg: string = 'connectWait delaySeconds: ' + delaySeconds;
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('cloudDisconnect', () => {
      const msg: string = 'cloudDisconnect';
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('cloudConnect', () => {
      const msg: string = 'cloudConnect';
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    socket.on('apikey', () => {
      const msg: string = 'apikey';
      const act: string = null;
      this.errorMsgStore.add({
        id: this.RID(),
        type: 'info',
        text: msg,
        action: act,
        scope: 'global'
      });
    });

    return () => socket.disconnect();
  }

  /** sets the new state to IoBroker */
  private setState(id, value) {
    socket.emit('setState', id, value, (error) => {
      if (error) {
        const msg: string = '!! SetState Error :' + error;
        const act: string = 'Repeat last transaction';
        this.errorMsgStore.add({
          id: this.RID(),
          type: 'danger',
          text: msg,
          action: act,
          scope: 'global'
        });
      }
    });
  }

  /** uses sentTo from ioBroker */
  public sendTo(instance, command, payload, callback) {
    socket.emit('sendTo', instance, command, payload, callback);
  }

  /**
   * get Random ID for ErrorStore handling
   *
   * @returns {string} randomID
   */
  private RID(): string {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

}
