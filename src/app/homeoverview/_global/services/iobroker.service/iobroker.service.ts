import { Injectable, OnDestroy, Inject } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import io from 'socket.io-client';
import { ErrorMsgStore } from '../../../app/store/error/error-msg.store';
import { IoBEnumStore } from '../../../app/store/enum/io-benum.store';
import { IoBStateStore } from '../../../app/store/state/io-bstate.store';
import { IoBObjectStore } from '../../../app/store/object/io-bobject.store';
import { IoBObject } from '../../../app/store/object/io-bobject.model';
import { IoBEnumQuery } from '../../../app/store/enum/io-benum.query';
import { IoBObjectQuery } from '../../../app/store/object/io-bobject.query';
import { EntityActions } from '@datorama/akita';
import { NewIOBStateQuery } from '../../../app/store/newstate/new-iobstate.query';
import { distinctUntilChanged } from 'rxjs/operators';
import { ErrorMsgSeverity, ErrorMsgScope, ErrorMsgLogging } from '../../../app/store/error/error-msg.model';
import { environment } from 'src/environments/environment';
import { DataService } from '../data.service/data-service';
import { CONNECTION_STATUS } from './iobroker.service.model';
import { MessageStore } from 'src/app/homeoverview/app/store/message/messages.store';
import { MessageType, MessageScope } from 'src/app/homeoverview/app/store/message/messages.model';
import { wholeClassMeasureTime } from '../../decorator/timeMeasure.decorator';

@Injectable({
    providedIn: 'root'
})
@wholeClassMeasureTime({print:false})
export class IOBrokerService implements OnDestroy {

    public loaded$ = new BehaviorSubject(false);
    public connectionState$ = new BehaviorSubject(CONNECTION_STATUS.disconnected)

    private isInitArray: any[] = [];
    private subscriptions: Subscription[] = [];
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
        this.setConnectionStatus();
    }

    private _isConnected = false;
    private _isReconnecting = false;

    private setConnectionStatus(){
        if(this._isReconnecting){
            this._isConnected === false;
            this.connectionState$.next(CONNECTION_STATUS.reconnecting);
            return;
        }
        if(this._isConnected && !this._isLoaded){
            this.connectionState$.next(CONNECTION_STATUS.connected);
            return;
        }
        if(this._isConnected && this._isLoaded){
            this.connectionState$.next(CONNECTION_STATUS.loaded);
            return;
        }
        this.connectionState$.next(CONNECTION_STATUS.disconnected);
    }

    constructor(
        private errorMsgStore: ErrorMsgStore,
        private messageStore: MessageStore,
        private ioBenumStore: IoBEnumStore,
        private ioBstateStore: IoBStateStore,
        private ioBobjectStore: IoBObjectStore,
        private ioBenumQuery: IoBEnumQuery,
        private ioBobjectQuery: IoBObjectQuery,
        private newIOBStateQuery: NewIOBStateQuery,
        @Inject(DataService) protected _service: DataService,
    ) {
        let subj = <Observable<any>>this._service.getData(environment.apiUrl + '/assets/app.menu.json');
        this.subscriptions.push(subj.subscribe(e => {
            let protocol: string = ('socket_protocol' in e.startUp) ? e.startUp.socket_protocol : window.location.protocol;
            let hostname: string = ('socket_hostname' in e.startUp) ? e.startUp.socket_hostname : environment.socket_hostname;
            let port: number = e.startUp.defaultSocketPort;
            let namespace: string = e.startUp.socketNamespace;
            this.init(protocol, hostname, port, namespace);
        }));
    }

    private init(protocol: string, host: string, port: number, namespace: string, folder?: string) {
        this.errorMsgStore.addNewErrorMsg({
            errorcode: "IOBS-0000",
            severity: ErrorMsgSeverity.SUCCESS,
            text: 'Init',
            action: '',
            scope: ErrorMsgScope.LOCAL,
            // stack: new Error().stack,
            logging: [ErrorMsgLogging.CONSOLE],
        });
        if (folder === undefined || folder === null) { folder = '' };
        this.namespace = namespace;
        this.socketUrl = protocol + '//' + host + ':' + port;
        let tempString = this.socketUrl + this.namespace + folder;
        if (tempString in this.isInitArray) { return };
        this.socketConfig = {
            query: 'key=',
            reconnectionDelay: 10000, // org 10000
            reconnectionAttempts: Infinity,
            reconnection: true,
            forceNew: true,
            transports: ['websocket']
        };
        this.connect();

        /** Listen to updates on the NewIOBStateStore */
        this.subscriptions.push(this.newIOBStateQuery.selectEntityAction().pipe(distinctUntilChanged()).subscribe(action => {
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
        }));
    }

    private connect() {
        this.socket = io.connect(this.socketUrl, this.socketConfig);
        this.socket.on('log', (obj) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0000",
                severity: ErrorMsgSeverity.LOG,
                text: obj,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });
        this.socket.on('connect', () => {
            const that = this;
            this._isReconnecting = false;
            this._isConnected = true;
            this.setConnectionStatus();
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-1000",
                severity: ErrorMsgSeverity.DEBUG,
                text: '=> connecting...',
                action: '',
                scope: ErrorMsgScope.LOCAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0000",
                severity: ErrorMsgSeverity.DEBUG,
                text: 'Socket ID :' + this.socket.id,
                action: '',
                scope: ErrorMsgScope.LOCAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0000",
                severity: ErrorMsgSeverity.SUCCESS,
                text: 'Socket Connected: ' + this.socket.connected,
                action: '',
                scope: ErrorMsgScope.LOCAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            // this.messageStore.addNewMessage({
            //     type: MessageType.SUCCESS,
            //     scope: MessageScope.GLOBAL,
            //     text: 'Connected to IoBroker Server',
            // });
            this.socket.emit('name', this.namespace, () => {
                setTimeout(() => {
                    const wait = setTimeout(() => {
                        this.errorMsgStore.addNewErrorMsg({
                            errorcode: "IOBS-0001",
                            severity: ErrorMsgSeverity.ERROR,
                            text: 'No answer from server',
                            action: 'Please relaod site',
                            scope: ErrorMsgScope.GLOBAL,
                            logging: [ErrorMsgLogging.CONSOLE],
                        });
                    }, 3000);
                    this.socket.emit('authenticate', (isOk, isSecure) => {
                        clearTimeout(wait);
                        if (isOk) {
                            this.socket.emit('getStates', '*', (err, data) => {
                                if (err) {
                                    this.errorMsgStore.addNewErrorMsg({
                                        errorcode: "IOBS-0002",
                                        severity: ErrorMsgSeverity.ERROR,
                                        text: 'getStates Error: ' + err,
                                        action: 'Try again the last task',
                                        scope: ErrorMsgScope.GLOBAL,
                                        logging: [ErrorMsgLogging.CONSOLE],
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
                                    this.errorMsgStore.addNewErrorMsg({
                                        errorcode: "IOBS-0003",
                                        severity: ErrorMsgSeverity.ERROR,
                                        text: 'getObjects Error: ' + err,
                                        action: 'Try again the last task',
                                        scope: ErrorMsgScope.GLOBAL,
                                        logging: [ ErrorMsgLogging.CONSOLE],
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
                                    this.errorMsgStore.addNewErrorMsg({
                                        errorcode: "IOBS-0004",
                                        severity: ErrorMsgSeverity.ERROR,
                                        text: 'getEnum Error: ' + err,
                                        action: 'Try again the last task',
                                        scope: ErrorMsgScope.GLOBAL,
                                        logging: [ErrorMsgLogging.CONSOLE],
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
                            this.errorMsgStore.addNewErrorMsg({
                                errorcode: "IOBS-0005",
                                severity: ErrorMsgSeverity.ERROR,
                                text: 'permissionError',
                                action: 'Reload Site',
                                scope: ErrorMsgScope.GLOBAL,
                                logging: [ErrorMsgLogging.CONSOLE],
                            });
                        }
                    });
                }, 50);
            });
        });

        this.socket.on('connect_error', (error) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0006",
                severity: ErrorMsgSeverity.FATAL,
                text: '!! connection_Error :' + error,
                action: 'Reload Site',
                stack: error,
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('connect_timeout', (timeout) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0007",
                severity: ErrorMsgSeverity.ERROR,
                text: '!! connect_timeout :' + timeout,
                action: 'Reload Site',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = true;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('error', (error) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0008",
                severity: ErrorMsgSeverity.WARN,
                text: '!! error :' + error,
                action: 'Unexpected, do not know how to help',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false
            this.setConnectionStatus();
        });

        this.socket.on('disconnect', (reason) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0009",
                severity: ErrorMsgSeverity.WARN,
                text: '!! Disconnected Reason:' + reason,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false
            this.setConnectionStatus();
        });

        this.socket.on('reconnect', (attemptNumber) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0010",
                severity: ErrorMsgSeverity.WARN,
                text: '!! Reconnected attempt number:' + attemptNumber,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = true;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('reconnect_attempt', (attemptNumber) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0011",
                severity: ErrorMsgSeverity.WARN,
                text: '!! Reconnected attempt number:' + attemptNumber,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = true;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('reconnecting', (attemptNumber) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0012",
                severity: ErrorMsgSeverity.WARN,
                text: '!! Reconnected attempt number:' + attemptNumber,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('reconnect_error', (error) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0013",
                severity: ErrorMsgSeverity.ERROR,
                text: '!! reconnect_error :' + error,
                action: 'Reload Site',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('reconnect_failed', () => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0014",
                severity: ErrorMsgSeverity.ERROR,
                text: '!! reconnect_failed',
                action: 'Reload Site',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('objectChange', (id, obj) => {
            if (this._isLoaded) {
                if (obj && 'type' in obj && obj.type === 'enum') {
                    let newMembers = []
                    obj.common.members.forEach((member: string) => {
                        if (member.startsWith('enum.')) {
                            let tempData = this.ioBenumQuery.getEntity(member).common.members;
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
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0015",
                severity: ErrorMsgSeverity.ERROR,
                text: '!! permissionError :' + error,
                action: 'Reload Site',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = false;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('reauthenticate', () => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0016",
                severity: ErrorMsgSeverity.WARN,
                text: '!! reauthenticate',
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('eventsThreshold', (hasThreshold) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0017",
                severity: ErrorMsgSeverity.INFO,
                text: '!! eventsThreshold: ' + hasThreshold,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('type', (id, obj) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0018",
                severity: ErrorMsgSeverity.INFO,
                text: 'Type id: ' + id + ' - obj: ' + obj,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('cmd', (id, data) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0019",
                severity: ErrorMsgSeverity.INFO,
                text: 'CMD id: ' + id + ' - data: ' + data,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('connectWait', (delaySeconds) => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0020",
                severity: ErrorMsgSeverity.WARN,
                text: 'connectWait delaySeconds: ' + delaySeconds,
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
            this._isReconnecting = true;
            this._isConnected = false;
            this.setConnectionStatus();
        });

        this.socket.on('cloudDisconnect', () => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0021",
                severity: ErrorMsgSeverity.WARN,
                text: 'cloudDisconnect',
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('cloudConnect', () => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0022",
                severity: ErrorMsgSeverity.INFO,
                text: 'cloudConnect',
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        this.socket.on('apikey', () => {
            this.errorMsgStore.addNewErrorMsg({
                errorcode: "IOBS-0023",
                severity: ErrorMsgSeverity.INFO,
                text: 'apikey',
                action: '',
                scope: ErrorMsgScope.GLOBAL,
                logging: [ErrorMsgLogging.CONSOLE],
            });
        });

        return () => this.socket.disconnect();
    }

    /** sets the new state to IoBroker */
    private setState(id, value) {
        this.socket.emit('setState', id, value, (error) => {
            if (error) {
                this.errorMsgStore.addNewErrorMsg({
                    errorcode: "IOBS-0024",
                    severity: ErrorMsgSeverity.ERROR,
                    text: '!! SetState Error :' + error,
                    action: 'Repeat last transaction',
                    scope: ErrorMsgScope.GLOBAL,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
        });
    }

    /** sets the new Object to IoBroker */
    public setObject(id, obj) {
        this.socket.emit('setObject', id, obj, (error) => {
            if (error) {
                this.errorMsgStore.addNewErrorMsg({
                    errorcode: "IOBS-0025",
                    severity: ErrorMsgSeverity.ERROR,
                    text: '!! setObject Error :' + error,
                    action: 'Repeat last transaction',
                    scope: ErrorMsgScope.GLOBAL,
                    logging: [ErrorMsgLogging.CONSOLE],
                });
            }
        });
    }

    /** uses sentTo from ioBroker */
    public sendTo(instance, command, payload, callback) {
        this.socket.emit('sendTo', instance, command, payload, callback);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe()
        });
        this.socket.close();
    }
}