import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { IoBObjectStore, IoBObjectState } from './io-bobject.store';
import { from, Observable } from 'rxjs';
import { IoBObject } from './io-bobject.model';
import { measureTime, wholeClassMeasureTime } from 'src/app/homeoverview/_global/decorator/timeMeasure.decorator';

/** to query the ioBObject Store */
@Injectable({ providedIn: 'root' })
@wholeClassMeasureTime({print:false})
export class IoBObjectQuery extends QueryEntity<IoBObjectState> {

  /** @ignore */
  constructor(protected store: IoBObjectStore) {
    super(store);
  }

  /** get the root domain Objects 'instances' ids */
  getAllInstanceIDS(exclusionFilter?: string[]): string[] {
    if (!exclusionFilter) { exclusionFilter = [] }
    return this.getAll({ filterBy: entity => entity.type === 'instance' && !exclusionFilter.includes(entity.id) }).map(e => e.id);
  }

  /** get all Channel ids */
  getAllChannelIDS(): string[] {
    return this.getAll({ filterBy: entity => entity.type === 'channel' }).map(e => e.id);
  }

  /** get all Device ids */
  getAllDeviceIDS(): string[] {
    return this.getAll({ filterBy: entity => entity.type === 'device' }).map(e => e.id);
  }

  /** get all states withIn an ObjectID (parentDomain) */
  getAllStatesIDWithinParentID_old(id: string): string[] {
    return this.getAll({ filterBy: entity => entity._id.startsWith(id) && entity.type === 'state' }).map(e => e.id);
  }

  /** get all states withIn an ObjectID (parentDomain) */
  getAllStatesIDWithinParentID(id: string): string[] {
    let all: IoBObject[] = this.getAll();
    let idList = [];
    let step: number;
    for (step = 0; step < all.length; step++) {
      let tmp = all[step];
      if(tmp._id.startsWith(id) && tmp.type === 'state'){
        idList.push(tmp.id);
      }
    }
    return idList;
  }
}
