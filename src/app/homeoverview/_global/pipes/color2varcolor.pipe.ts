import { Pipe, PipeTransform } from '@angular/core';

const CURRENT_LANGUAGE = 'de';

@Pipe({
    name: 'color2varcolor',
    pure: true
})
export class Color2VarColor implements PipeTransform {

    transform(color: string): string {
        return `var(--ion-color-${color})`;
    }

}