import { NamedItem, RegistryLike, Registry } from '../src/registry';

export type WILDCARD_SHORTHAND = '*';

export const WILDCARD_SHORTHAND: WILDCARD_SHORTHAND = '*';

export interface Wildcard<T> {
  name: string;
  enumerate: Generator<T>
}

export type WildcardProperty<T> = T | Wildcard<T> | WILDCARD_SHORTHAND;


