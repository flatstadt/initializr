import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Initializable, InitializableBundle, InitializrLoader } from '@lapita/initializr';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable()
export class AppViewsLoader implements InitializrLoader {
    constructor() {
        console.log('APP VIEWS LOADER');
    }

    read(): InitializableBundle[] {
        const batchs: Initializable[] = [];
        batchs.push(new ViewDefinition('users'));
        batchs.push(new ViewDefinition('clients'));
        batchs.push(new ViewDefinition('products'));
        batchs.push(new ViewDefinition('purchases'));

        const bundles: InitializableBundle[] = [];
        bundles.push({
            items: batchs,
            name: 'Boot',
            load: 'parallel',
            trigger: 'onInit',
        });

        return bundles;
    }
}

export class ViewDefinition implements Initializable {
    constructor(private name) {}

    load(injector: Injector): boolean | Observable<boolean> {
        // Use the interceptor to get any necessary service to load data
        const http = injector.get(HttpClient);
        return of(true).pipe(
            tap(_ => console.log(`🗺loading view ${this.name}`)),
            delay(3000 * Math.random()),
            tap(_ => console.log(`view ${this.name} loaded!`))
        );
    }
}
