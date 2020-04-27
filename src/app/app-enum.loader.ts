import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Initializable, InitializableBundle, InitializrLoader } from '@lapita/initializr';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable()
export class AppEnumsLoader implements InitializrLoader {
    constructor() {
        console.log('APP ENUMS LOADER');
    }

    read(): InitializableBundle[] {
        const batchs: Initializable[] = [];
        batchs.push(new AppEnum('product_status'));
        batchs.push(new AppEnum('purchase_status'));
        batchs.push(new AppEnum('client_type'));
        batchs.push(new AppEnum('shipping'));
        batchs.push(new AppEnum('user_role'));

        const bundles: InitializableBundle[] = [];
        bundles.push({
            items: batchs,
            name: 'Boot',
            load: 'sequential',
            trigger: 'onInit',
        });

        return bundles;
    }
}

export class AppEnum implements Initializable {
    constructor(private name) {}

    load(injector: Injector): boolean | Observable<boolean> {
        // Use the interceptor to get any necessary service to load data
        const http = injector.get(HttpClient);
        // replace of(true) by throwError('error'), stops the app from loading
        return of(true).pipe(
            tap(_ => console.log(`🌳loading enum ${this.name}`)),
            delay(3000 * Math.random()),
            tap(_ => console.log(`enum ${this.name} loaded!`))
        );
    }
}
