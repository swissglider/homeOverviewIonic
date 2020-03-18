export interface InputButton {
    color?: string,
    disabled?: boolean,
    buttonID: string,
    showText?: string,
    showImage?: string,
    icon?: string,
    slot?: 'start' | 'end',
    value: any,
    order?: number,
}

export interface InputButtons{
    buttons: InputButton[],
}

export interface OutputButtonValue{
    buttonID: string
    value: any,
}