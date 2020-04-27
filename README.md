[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
[![flatstadt](https://img.shields.io/badge/@-flatstadt-383636?style=flat-square&labelColor=8f68d4)](https://github.com/flatstadt/)


> A simple way to initialize stuff

Initializr provides a simple way to declare logic that needs to be initialize before the user starts interacting with the app.

## Features

- ✅ Load on boot
- ✅ Load on demand

## Table of Contents

- [Features](#features)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [NPM](#npm)
  - [Yarn](#yarn)
- [Usage](#usage)
- [Contributors](#contributors)


## Installation

### NPM

`npm install @lapita/initializr --save`

### Yarn

`yarn add @lapita/initializr`

## Usage
Add `InitializrModule` to the root Module (AppModule).

Initializr makes use of defintion providers that declare the load logic that will be later called by Initializr.

A definition provider extends `InitializrLoader`. 

```ts
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
```
This loader needs to implement a method read which returns a `InitializableBundle`. 

```ts
export interface InitializableBundle {
  name: string; // bundle name
  items: Initializable[]; // items to initialize
  trigger: 'onInit' | 'manual'; // how to load the bundle
  load: 'sequential' | 'parallel'; // how to load each of the items
}
```

An item is a `Initializable` class that contains a `load()` method that executed a payload. 

```ts
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

```

Every `InitializrLoader` needs to be registered using an injection token `INITIALIZR_LOADER`. This is done in AppModule.

```ts
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { INITIALIZR_LOADER, InitializrModule } from '@lapita/initializr';

import { AppEnumsLoader } from './app-enum.loader';
import { AppViewsLoader } from './app-views.loader';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, HttpClientModule, InitializrModule],
    providers: [
        {provide: INITIALIZR_LOADER, useClass: AppEnumsLoader, multi: true},
        {provide: INITIALIZR_LOADER, useClass: AppViewsLoader, multi: true},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
```

* `InitializrService` - Loads a given `InitializrBundle`

This service can be injected into any component, guard and resolver, to perform a manual load of a given `InitializrBundle`. 
```ts
interface InitializerService {
    load(name: string): Observable<boolean>;
}
```

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://carlosvilacha.com"><img src="https://avatars3.githubusercontent.com/u/1565222?v=4" width="100px;" alt=""/><br /><sub><b>Carlos Vilacha</b></sub></a><br /><a href="https://github.com/@flatstadt/matlazy/commits?author=flatstadt" title="Code">💻</a> <a href="https://github.com/@flatstadt/matlazy/commits?author=flatstadt" title="Documentation">📖</a> <a href="#ideas-flatstadt" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
