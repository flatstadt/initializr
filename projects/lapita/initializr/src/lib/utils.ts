import { isObservable, Observable, of } from 'rxjs';

export function coerceToArray<U>(array: U | U[]) {
  return Array.isArray(array) ? array : [array];
}

export function coerceToObservable<U>(obs: Observable<U> | U) {
  return isObservable(obs) ? obs : of(obs);
}
