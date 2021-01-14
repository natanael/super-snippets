import cp from 'child_process';
import { clipboard } from 'electron';
import { snakeCase as _snakeCase } from 'lodash';
import { windowApi } from './api.type'

windowApi.getSrcContent = () => {
  // return cp.spawn('bash', ['-c', `find src -type f`]).stdout.toString().split('\n');
  return cp.execSync(`find src -type f`).toString().split('\n');
}

windowApi.getClipboard = () => {
  return clipboard.readText('selection');
};

windowApi.setClipboard = (value: string) => {
  clipboard.writeText(value);
};

windowApi.snakeCase = (value: string) => _snakeCase(value);