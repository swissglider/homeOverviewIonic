import { Pipe, PipeTransform } from '@angular/core';

const CURRENT_LANGUAGE = 'de';

@Pipe({
    name: 'getname',
    pure: true
})
export class GetNamePipe implements PipeTransform {

    transform(name: string | object): string {
        if (typeof name === 'object') {
            if (CURRENT_LANGUAGE in name) {
                return name[CURRENT_LANGUAGE];
            } else if ('en' in name) {
                return name['en'];
            } else {
                return ''; 
            }
        }
        return name;
    }

}