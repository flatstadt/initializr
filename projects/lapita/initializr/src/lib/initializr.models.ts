import { Injector } from '@angular/core';
import { Observable } from 'rxjs';

export interface InitializableBundle {
  name: string;
  items: Initializable[];
  trigger: 'onInit' | 'manual';
  load: 'sequential' | 'parallel';
}

export interface Initializable {
  load(injector: Injector): Observable<boolean> | boolean;
}

export interface InitializrLoader {
  read(): InitializableBundle[];
}
