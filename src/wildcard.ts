import { NamedItem, RegistryLike, Registry } from '../src/registry';

// shortcut for wildcard
export type WILDCARD_SHORTHAND = '*';
export const WILDCARD_SHORTHAND: WILDCARD_SHORTHAND = '*';

// TODO: merge with RegistryLike?
export interface Wildcard<T extends NamedItem> {
  name: string;
  enumerate(): Generator<T>;
}

// for resolving wildcards
export type WildcardProperty<T extends NamedItem> = T | Wildcard<T> | WILDCARD_SHORTHAND;

// if we have a registry, we can just use it as a wildcard
export class RegistryWildcard<T extends NamedItem> implements Wildcard<T> {
  name: string;
  registry: RegistryLike<T>;
  
  constructor(name: string, registry: RegistryLike<T>) {
    this.name = name;
    this.registry = registry;
  }

  *enumerate(): Generator<T> {
    yield* this.registry.getItems();
  }
}
