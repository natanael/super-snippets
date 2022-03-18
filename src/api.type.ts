export interface API {
  getSrcContent(): Array<string>;
  getClipboard(): string;
  setClipboard(value: string): void;
  snakeCase(value: string): string;
}
