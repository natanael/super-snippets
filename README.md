# super-snippets
This is a minimal project to run custom snippets on the clipboard content.
I did not push this to npm because right now the only way to setup the snippets is to alter its source code.
To add some snippets of your own just edit `renderer.ts` and add something like:
```typescript
  globalSnippetManager.addSnippet({
    context: 'C++',
    name: 'cout',
    keycode: 'Numpad1',
    shortcutLabel: '1',
    snippet(text: string) {
      return text.split('\n').filter(Boolean).map(line => this.perElement(line)).join('\n');
    },
    perElement(element: string) { // Forces cast, but keep it organized
      return `cout << "${element}" << ${element} << endl;`;
    }
  } as Snippet);
```
This snippet in particular turns
```
  foo
  bar
```
into
```c++
  cout << "foo" << foo << endl;
  cout << "bar" << bar << endl;
```

# Usage
Then you can run this project with `yarn start`.
If you want to have to have some reloading while you work your snippets use `yarn watch:build` and `yarn watch:run` in different terminals.

# Other
You can also just strip all out and use it as a sample `Typescript` + `Electron` app, I just didn't script the executable build steps.