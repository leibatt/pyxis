
// object has a name
export interface NamedItem {
  name: string;
}

// object has a name and a generator that yields named items of type T
export interface RegistryLike<T extends NamedItem> {
  name: string;
  getItems(): Generator<T>
}

export class Registry<T extends NamedItem> implements RegistryLike<T> {
  name: string;
  items: Record<string, T>;

  constructor(name: string, initialItems?: T[]) {
    this.name = name;
    this.items = {};
    if(initialItems !== undefined) {
      initialItems.forEach(i => { this.items[i.name] = i; });
    }
  }

  // add an item to the registry or replace existing item
  add(item: T): void {
    this.items[item.name] = item;
  }

  // remove item from registry according to name
  remove(item: T): boolean {
    if(item.name in this.items) {
      delete this.items[item.name];
      return true;
    }
    return false;
  }

  // return generator that iterates over each item in the registry
  *getItems(): Generator<T> {
    for(const name in this.items) {
      yield this.items[name];
    }
  }
}
