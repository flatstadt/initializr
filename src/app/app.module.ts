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
