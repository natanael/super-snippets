export interface Snippet {
  context: 'Base Actions' | 'C++' | 'TS' | 'Jira';
  name: string;
  keycode: KeyboardEvent["code"];
  shortcutLabel: string;
  snippet(value: string): string;
}

export interface GenericUiUpdater {
  addSnippet(snippet: Snippet, onClick: () => void): void;
  getInputText(): string;
  setInputText(text: string): void;
  setOutputText(text: string): void;
}

export interface UiButtonContext {
  buttonArea: Node;
  buttons: { [name: string]: Node };
}
