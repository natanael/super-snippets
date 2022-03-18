import cp from 'child_process';
import { clipboard, contextBridge } from 'electron';
import { snakeCase as _snakeCase } from 'lodash';
import { API } from './api.type'

const windowApi: API = {
  getSrcContent: () => {
    // return cp.spawn('bash', ['-c', `find src -type f`]).stdout.toString().split('\n');
    return cp.execSync(`find src -type f`).toString().split('\n');
  },
  getClipboard: () => {
    return clipboard.readText('selection');
  },
  setClipboard: (value: string) => {
    clipboard.writeText(value);
  },
  snakeCase: (value: string) => _snakeCase(value),
}

contextBridge.exposeInMainWorld("windowApi", windowApi);

console.log('Was PRELOAD ever loaded? Yes');