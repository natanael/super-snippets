import { windowApi } from "../api.type";
import { GenericUiUpdater, Snippet } from "./types";

export class SnippetManager {
  // snippets : {[context: string]: {[name: string]: Snippet}} = {};
  snippets : Array<Snippet> = [];
  constructor(private readonly uiUpdater: GenericUiUpdater) {}
  refresh() {
    this.uiUpdater.setInputText(windowApi.getClipboard());
  }
  addSnippet(snippet: Snippet) {
    this.snippets.push(snippet);
    this.uiUpdater.addSnippet(snippet, () => this.runSnippet(snippet));
  }
  runSnippet(snippet: Snippet) {
    const inputText = this.uiUpdater.getInputText();
    let outputText: string;
    try {
      outputText = snippet.snippet(inputText);
    } catch (e) {
      outputText = `${e.message}\n${e.stack}`;
    }
    this.uiUpdater.setOutputText(outputText);
    windowApi.setClipboard(outputText);
  }
  handleKeypress(event: KeyboardEvent) {
    const match = this.snippets.find(snippet => snippet.keycode === event.code);
    if (match == null) { console.log(`Found no snippet for code ${event.code}`); return; }
    this.runSnippet(match);
  }
}
