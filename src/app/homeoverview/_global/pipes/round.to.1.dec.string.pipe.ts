import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundto1decstring',
    pure: true
})
export class RoundTo1DecString implements PipeTransform {

    transform(num: number): string {
        return num.toFixed(1);
    }

}