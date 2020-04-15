import { Pipe, PipeTransform } from '@angular/core';

const CURRENT_LANGUAGE = 'de';

@Pipe({
    name: 'date2localstring',
    pure: true
})
export class Date2LocalString implements PipeTransform {

    transform(da: Date): string {
        return da.toLocaleString();
    }

}