export interface API {
  getSrcContent(): Array<string>;
  getClipboard(): string;
  setClipboard(value: string): void;
}

export const windowApi = (window as any as API);