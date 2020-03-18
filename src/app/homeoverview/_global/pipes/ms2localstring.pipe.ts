import { Pipe, PipeTransform } from '@angular/core';

const CURRENT_LANGUAGE = 'de';

@Pipe({
    name: 'ms2localstring',
    pure: true
})
export class MS2LocalString implements PipeTransform {

    transform(ms: number): string {
        return new Date(ms).toLocaleString();
    }

}