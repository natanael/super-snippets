import {windowApi} from './api.type'
import { SnippetManager } from './renderer/snippet-manager';
import { Snippet } from './renderer/types';
import { UiUpdater } from './renderer/ui-updater';

const inTxt$ = document.getElementById('in-txt') as any as HTMLTextAreaElement;
inTxt$.innerHTML = windowApi.getSrcContent().join('\n');

const uiUpdater = new UiUpdater();
const globalSnippetManager = new SnippetManager(uiUpdater);
document.addEventListener('keypress', (e) => globalSnippetManager.handleKeypress(e));

globalSnippetManager.addSnippet({
  context: 'Base Actions',
  name: 'Refresh',
  keycode: 'Numpad0',
  shortcutLabel: '0',
  snippet(text: string) {
    globalSnippetManager.refresh();
    return windowApi.getClipboard();
  }
});

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

