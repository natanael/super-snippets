import { GenericUiUpdater, Snippet, UiButtonContext } from "./types";
import { createSingleElement } from "./utils";

export class UiUpdater implements GenericUiUpdater {
  buttonAnchorElem: Node;
  inputTextElem: HTMLTextAreaElement;
  outputTextElem: HTMLTextAreaElement;
  buttonStructure: { [context: string]: UiButtonContext } = {};
  constructor() {
    this.inputTextElem = document.getElementById('in-txt') as any;
    this.outputTextElem = document.getElementById('out-txt') as any;
    this.buttonAnchorElem = document.getElementById('button-anchor')!;
  }
  createNewContext(contextName: string): UiButtonContext {
    const contextElem = createSingleElement(`<div class="button-area">
      <div class="title">${contextName}</div>
    </div>`);
    const buttonAreaElem = createSingleElement(`<div class="buttons"></div>`);
    contextElem.appendChild(buttonAreaElem);
    this.buttonAnchorElem.appendChild(contextElem);
    return {
      buttonArea: buttonAreaElem,
      buttons: {}
    };
  }
  createNewButton(context: UiButtonContext, {name, shortcutLabel}: Snippet, onClick: () => void): Node {
    const buttonElem = createSingleElement(`<button id="refresh-btn" class="button is-link is-light">
      <span class="shortcut">${shortcutLabel}</span>
      <span class="label">${name}</span>
    </button>`);
    buttonElem.addEventListener('click', onClick);
    context.buttonArea.appendChild(buttonElem);
    return buttonElem;
  }
  getInputText() {
    return this.inputTextElem.innerText;
  }
  setInputText(text: string) {
    this.inputTextElem.innerText = text;
  }
  setOutputText(text: string) {
    this.outputTextElem.innerText = text;
  }
  addSnippet(snippet: Snippet, onClick: () => void) {
    if (this.buttonStructure[snippet.context] == null) {
      this.buttonStructure[snippet.context] = this.createNewContext(snippet.context);
    }
    const context = this.buttonStructure[snippet.context];
    if (context[snippet.name] == null) {
      context[snippet.name] = this.createNewButton(context, snippet, onClick);
    }
  }
}


