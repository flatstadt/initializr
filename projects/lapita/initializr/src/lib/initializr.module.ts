import { APP_INITIALIZER, NgModule } from '@angular/core';

import { InitializerService } from './initializr.service';

// tslint:disable-next-line: ban-types
export function onAppInit(initializer: InitializerService): Function {
    const fcn = function name() {
        return initializer.bootload().toPromise();
    };
    return fcn;
}

function factory(initializer: InitializerService) {
    return initializer.bootload().toPromise();
}

@NgModule({
    providers: [
        InitializerService,
        {
            provide: APP_INITIALIZER,
            useFactory: onAppInit,
            multi: true,
            deps: [InitializerService],
        },
    ],
})
export class InitializrModule {}
