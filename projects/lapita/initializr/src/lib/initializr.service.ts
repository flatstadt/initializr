import { Inject, Injectable, Injector, Optional } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { concatAll, map, reduce } from 'rxjs/operators';

import { InitializableBundle, InitializrLoader } from './initializr.models';
import { INITIALIZR_LOADER } from './initializr.tokens';
import { coerceToArray, coerceToObservable } from './utils';

@Injectable()
export class InitializerService {
    private bundles: InitializableBundle[];

    constructor(
        private injector: Injector,
        @Optional() @Inject(INITIALIZR_LOADER) payloads: InitializrLoader | InitializrLoader[] = []
    ) {
        this.bundles = coerceToArray(payloads)
            .map(p => p.read())
            .reduce((list, bundles) => list.concat(...bundles), []);
    }

    public load(name: string): Observable<boolean> {
        const bundle = this.bundles.find(b => b.name === name);
        if (!bundle) {
            return of(false);
        }
        if (bundle.load === 'sequential') {
            return this.loadSequentially(bundle);
        }
        return this.loadInParallel(bundle);
    }

    public bootload(): Observable<boolean> {
        const obs = this.bundles
            .filter(b => b.trigger === 'onInit')
            .map(b => (b.load === 'sequential' ? this.loadSequentially(b) : this.loadInParallel(b)));
        return of(...obs).pipe(
            concatAll(),
            reduce((ac, el) => ac && el)
        );
    }

    private loadSequentially(bundle: InitializableBundle) {
        return of(...bundle.items.map(i => coerceToObservable(i.load(this.injector))))
            .pipe(concatAll())
            .pipe(reduce((ac, el) => ac && el));
    }

    private loadInParallel(bundle: InitializableBundle) {
        return forkJoin(bundle.items.map(i => coerceToObservable(i.load(this.injector)))).pipe(map(r => r.reduce((ac, el) => ac && el)));
    }
}
