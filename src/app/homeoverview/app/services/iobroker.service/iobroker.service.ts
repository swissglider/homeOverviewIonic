import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import io from 'socket.io-client';
import { ErrorMsgStore } from '../../store/error/error-msg.store';
import { IoBEnumStore } from '../../store/enum/io-benum.store';
import { IoBStateStore } from '../../store/state/io-bstate.store';
import { IoBObjectStore } from '../../store/object/io-bobject.store';
import { IoBObject } from '../../store/object/io-bobject.model';
import { IoBEnumQuery } from '../../store/enum/io-benum.query';
import { IoBObjectQuery } from '../../store/object/io-bobject.query';
import { EntityActions } from '@datorama/akita';
import { NewIOBStateQuery } from '../../store/newstate/new-iobstate.query';

@Injectable({
    providedIn: 'root'
})
export class IOBrokerService {

    public loaded$ = new BehaviorSubject(false);

    private socket;
    private socketConfig;
    private socketUrl: string;
    private namespace: string;
    private _loaded = {
        states: false,
        objects: false,
        enums: false
    };
    private _isLoaded = false;

    private setLoaded(name: string, value: boolean) {
        if (name in this._loaded) {
            this._loaded[name] = value;
        }
        if (this._isLoaded) {
            this.ioBobjectStore.setLoading(false);
            this.ioBstateStore.setLoading(false);
        } else {
            this.ioBobjectStore.setLoading(true);
            this.ioBstateStore.setLoading(true);
        }
        this._isLoaded = Object.values(this._loaded).every(elem => elem === true);
        this.loaded$.next(this._isLoaded);
    }

    constructor(
        private errorMsgStore: ErrorMsgStore,
        private ioBenumStore: IoBEnumStore,
        private ioBstateStore: IoBStateStore,
        private ioBobjectStore: IoBObjectStore,
        private ioBenumQuery: IoBEnumQuery,
        private ioBobjectQuery: IoBObjectQuery,
        private newIOBStateQuery: NewIOBStateQuery,
    ) {}

    init(protocol: string, host: string, port: number, namespace: string, folder?: string) {
        this.socketUrl = protocol + '://' + host + ':' + port;
        this.socketConfig = {
            query: 'key=',
            reconnectionDelay: 10000, // org 10000
            reconnectionAttempts: Infinity,
            reconnection: true,
            forceNew: true,
            transports: ['websocket']
        };
        this.namespace = namespace;
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
    }

    private connect() {
        this.socket = io.connect(this.socketUrl, this.socketConfig);
        this.socket.on('log', (obj) => {
            console.log('-------------- LOG --------------');
            console.log(obj);
        });
        this.socket.on('connect', () => {
            const that = this;
            console.log('=> connecting...');
            console.log('Socket ID :' + this.socket.id);
            console.log('Socket Connected: ' + this.socket.connected);
            console.log('Socket Disconnected: ' + this.socket.disconnected);
            this.socket.emit('name', this.namespace, () => {
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
                    this.socket.emit('authenticate', (isOk, isSecure) => {
                        clearTimeout(wait);
                        if (isOk) {
                            this.socket.emit('getStates', '*', (err, data) => {
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
                                this.socket.emit('subscribe', '*', () => {
                                    this.setLoaded('states', true);
                                });
                            });
                            this.socket.emit('getObjects', (err, data) => {
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
                                    let rows = Object.values(data).map((t: IoBObject) => {
                                        if ('_id' in t) {
                                            t['id'] = t['_id'];
                                        }
                                        return t;
                                    });
                                    this.ioBobjectStore.upsertMany(rows);
                                }
                                this.socket.emit('subscribeObjects', '*', () => {
                                    this.setLoaded('objects', true);
                                });
                            });
                            this.socket.emit('getObjectView', 'system', 'device', {
                                startkey: '',
                                endkey: '' + '\u9999'
                            }, (err, data) => {
                                if (data) {
                                    let rows = data.rows.map(x => {
                                        let t = x.value;
                                        if ('_id' in t) {
                                            t.id = t._id;
                                        }
                                        return t;
                                    });
                                    this.ioBobjectStore.upsertMany(rows);
                                }
                            });
                            this.socket.emit('getObjectView', 'system', 'channel', {
                                startkey: '',
                                endkey: '' + '\u9999'
                            }, (err, data) => {
                                if (data) {
                                    let rows = data.rows.map(x => {
                                        let t = x.value;
                                        if ('_id' in t) {
                                            t.id = t._id;
                                        }
                                        return t;
                                    });
                                    this.ioBobjectStore.upsertMany(rows);
                                }
                            });
                            this.socket.emit('getObjectView', 'system', 'instance', {
                                startkey: '',
                                endkey: '' + '\u9999'
                            }, (err, data) => {
                                if (data) {
                                    let rows = data.rows.map(x => {
                                        let t = x.value;
                                        t.org_id = t._id;
                                        let id_split = t._id.split('.');
                                        t.id = id_split[id_split.length - 2] + '.' + id_split[id_split.length - 1];
                                        t._id = t.id;
                                        t.common.name = t.common.title;
                                        return t;
                                    });
                                    this.ioBobjectStore.upsertMany(rows);
                                }
                            });
                            this.socket.emit('getObjectView', 'system', 'enum', {
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
                                            value.common.members.forEach((member: string) => {
                                                if (member.startsWith('enum.')) {
                                                    let tempData = data.rows.filter(e => e.id === member);
                                                    if (tempData.length > 0) {
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
                            this.socket.emit('authEnabled', (authEnabled, currentUser) => {
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

        this.socket.on('connect_error', (error) => {
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

        this.socket.on('connect_timeout', (timeout) => {
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

        this.socket.on('error', (error) => {
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

        this.socket.on('disconnect', (reason) => {
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

        this.socket.on('reconnect', (attemptNumber) => {
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

        this.socket.on('reconnect_attempt', (attemptNumber) => {
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

        this.socket.on('reconnecting', (attemptNumber) => {
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

        this.socket.on('reconnect_error', (error) => {
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

        this.socket.on('reconnect_failed', () => {
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

        this.socket.on('objectChange', (id, obj) => {
            if (this._isLoaded) {
                if (obj && 'type' in obj && obj.type === 'enum') {
                    let newMembers = []
                    obj.common.members.forEach((member: string) => {
                        if (member.startsWith('enum.')) {
                            let tempData = this.ioBenumQuery.getMembersPerEntity(member);
                            if (tempData.length > 0) {
                                newMembers = newMembers.concat(tempData);
                            }
                        } else {
                            newMembers.push(member)
                        }
                    });
                    try {
                        obj.common.allMembers = newMembers;
                        this.ioBenumStore.upsert(id, obj);
                    } catch (e) { }
                }
                else {
                    if (obj === null) {
                        if (this.ioBenumQuery.hasEntity(id)) {
                            this.ioBenumStore.remove(id);
                        }
                        if (this.ioBobjectQuery.hasEntity(id))
                            this.ioBobjectStore.remove(id);

                    } else {
                        this.ioBobjectStore.upsert(id, obj);
                    }
                }
            }
        });

        this.socket.on('stateChange', (id, state) => {
            if (this._isLoaded) {
                if (state === null) {
                    this.ioBstateStore.remove(id)
                } else {
                    state.id = id;
                    this.ioBstateStore.upsert(id, state);
                }
            }
        });

        this.socket.on('permissionError', (error) => {
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

        this.socket.on('reauthenticate', () => {
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

        this.socket.on('eventsThreshold', (hasThreshold) => {
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

        this.socket.on('type', (id, obj) => {
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

        this.socket.on('cmd', (id, data) => {
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

        this.socket.on('connectWait', (delaySeconds) => {
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

        this.socket.on('cloudDisconnect', () => {
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

        this.socket.on('cloudConnect', () => {
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

        this.socket.on('apikey', () => {
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

        return () => this.socket.disconnect();
    }

    /** sets the new state to IoBroker */
    private setState(id, value) {
        this.socket.emit('setState', id, value, (error) => {
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

    /** sets the new Object to IoBroker */
    public setObject(id, obj) {
        this.socket.emit('setObject', id, obj, (error) => {
            if (error) {
                const msg: string = '!! setObject Error :' + error;
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
        this.socket.emit('sendTo', instance, command, payload, callback);
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