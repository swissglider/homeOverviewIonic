import { Pipe, PipeTransform } from '@angular/core';

const CURRENT_LANGUAGE = 'de';

@Pipe({
    name: 'ms2time',
    pure: true
})
export class MS2Time implements PipeTransform {

    transform(ms: number): string {
        return new Date(ms).toLocaleTimeString();
    }

}