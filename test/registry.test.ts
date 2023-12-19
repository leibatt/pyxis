import { Registry } from '../src/registry';

describe('registry.ts tests', () => {
  interface Book {
    name: string;
    author: string;
  }
  describe('Registry', () => {
    test('#constructor works', () => {
      const bookRegistry: Registry<Book> = new Registry<Book>("bookRegistry");
      expect(bookRegistry.name).toBe("bookRegistry");
    });

    test('#add to registry', () => {
      const bookRegistry: Registry<Book> = new Registry<Book>("bookRegistry");
      bookRegistry.add({name:'A Single Shard', author: 'Linda Sue Park'});
      expect('A Single Shard' in bookRegistry.items).toBeTruthy();
    });
    test('#getItems generator yields items', () => {
      const bookRegistry: Registry<Book> = new Registry<Book>("bookRegistry");
      bookRegistry.add({name:'A Single Shard', author: 'Linda Sue Park'});
      bookRegistry.add({name:'We Should All Be Millionaires', author: 'Rachel Rodgers'});
      const books: Generator<Book> = bookRegistry.getItems();
      expect(books.next().value.name).toBe('A Single Shard');
      expect(books.next().value.name).toBe('We Should All Be Millionaires');
    });
    test('#remove from registry using name', () => {
      const bookRegistry: Registry<Book> = new Registry<Book>("bookRegistry");
      bookRegistry.add({name:'A Single Shard', author: 'Linda Sue Park'});
      bookRegistry.remove({name:'A Single Shard', author: 'Linda Sue Park'});
      expect('A Single Shard' in bookRegistry.items).toBeFalsy();
    });
  });
});
