import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'roundto2decstring',
    pure: true
})
export class RoundTo2DecString implements PipeTransform {

    transform(num: number): string {
        return num.toFixed(2);
    }

}