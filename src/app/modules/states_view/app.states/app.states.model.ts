import { Observable } from 'rxjs';
import { IoBEnum } from 'src/app/store/enum/io-benum.model';

export interface AppStatesModel1 {
    // $function_enum: Observable<IoBEnum>,
    function_id: string,
    state_ids: Observable<string[]>,
}

export interface AppStatesModel {
    // $function_enum: Observable<IoBEnum>,
    [key: string]: {
        [key: string]: string[],
    },
}