import { Injectable } from '@angular/core';
import { NewIOBStateStore } from '../store/newstate/new-iobstate.store';
import { IoBObjectQuery } from '../store/object/io-bobject.query';

@Injectable({
    providedIn: 'root'
})
export class HelperService {
    language = 'de'
    constructor(
        private newIOBStateStore: NewIOBStateStore,
        private objectQuery: IoBObjectQuery
    ) { }

    public getByLanguage(value): string {
        if (typeof value === 'object') {
            if (this.language in value) {
                return value[this.language];
            } else if ('en' in value) {
                return value.en;
            }
        }
        return value;
    }



    public functionToggle(ids: Array<string>, state) {
        ids.forEach((id: string) => {
            try {
                if(this.objectQuery.getWritableByID(id)){
                    this.newIOBStateStore.upsert(id, {
                        val: state,
                        id: id,
                    });
                }
            } catch (error) {
                console.log(id)
                console.log('error')
            }
            
        })
    }
}