import { environment } from 'src/environments/environment';

export let measureTimeTotalC: { [functionID: string]: { counter: number, totalTime: number } }[] = [];

export const wholeClassMeasureTime = (params: {}) => {
    if (environment.production) { return };
    return (target: Function) => {
        let keys = Reflect.ownKeys(target.prototype);
        for(let step = 0; step < keys.length; step++){
            let key = keys[step];
            if (key === 'constructor') continue;
            var descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
            if (typeof descriptor.value === 'function') {
                const originalMethod = descriptor.value;
                descriptor.value = function (...args: any[]) {
                    let performance = window.performance;
                    let t0 = performance.now();
                    const result = originalMethod.apply(this, args);
                    let t1 = performance.now();
                    if ('print' in params && params['print']) {
                        console.log('%c Time for: [/app/overview : ' + key.toString() + '] = ' + (t1 - t0) + 'ms', 'background: #EEEDED; color: #DF0D0D; font-weight: bold');
                    }
                    let propClass = this.constructor.name + ':' + key.toString();
                    if (!(propClass in measureTimeTotalC)) {
                        measureTimeTotalC[propClass] = {
                            counter: 1,
                            totalTime: t1 - t0
                        }
                    } else {
                        measureTimeTotalC[propClass].counter = measureTimeTotalC[propClass].counter + 1;
                        measureTimeTotalC[propClass].totalTime = measureTimeTotalC[propClass].totalTime + (t1 - t0);
                    }
                    return result;
                };
                Object.defineProperty(target.prototype, key, descriptor);
            }
        }
    }
}

export const measureTime = (params: {}) => {
    if (environment.production) { return };
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalMethod = descriptor.value;
        let i = 0;

        descriptor.value = function (...args: any[]) {
            let performance = window.performance;
            let t0 = performance.now();
            const result = originalMethod.apply(this, args);
            let t1 = performance.now();
            if ('print' in params && params['print']) {
                console.log('%c Time for: [/app/overview : ' + propertyKey + '] = ' + (t1 - t0) + 'ms', 'background: #EEEDED; color: #DF0D0D; font-weight: bold');
            }
            let propClass = this.constructor.name + ':' + propertyKey;
            return result;
        };
        return descriptor;
    }

}