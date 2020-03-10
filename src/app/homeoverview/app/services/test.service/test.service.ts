import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {

    private returnObs: Observable<boolean>;

    constructor() {
        this.returnObs = new Observable(this.createRoute);
    }

    private createRoute = (observer) => {
        observer.next(false);
        setTimeout(()=>{
            observer.next(true);
            observer.complete();
        }, 2000);
    };

    public isFinished():Observable<boolean>{
        return this.returnObs;
    }
}