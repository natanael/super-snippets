export function createSingleElement(html: string) {
  const template = document.createElement('template');
  template.insertAdjacentHTML('afterbegin', html);
  return template.firstElementChild;
}
