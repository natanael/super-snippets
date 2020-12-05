import {windowApi} from './api.type'

const inTxt$ = document.getElementById('in-txt') as any as HTMLTextAreaElement;
const outTxt$ = document.getElementById('out-txt')!;
const buttonAnchor$ = document.getElementById('button-anchor')!;
inTxt$.innerHTML = windowApi.getSrcContent().join('\n');
console.log(windowApi.getSrcContent());

document.addEventListener('keypress', (e) => {
  console.log(e.code);
  if (e.code == 'Numpad0') {
    inTxt$.innerHTML = windowApi.getClipboard();
  }
  console.log(e.code == 'Numpad1');
  if (e.code == 'Numpad1') {
    const newValue = `new value`;
    outTxt$.innerHTML = newValue;
    windowApi.setClipboard(newValue);
  }
});