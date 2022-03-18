import { split } from 'lodash';
import { API } from './api.type'
import { SnippetManager } from './renderer/snippet-manager';
import { Snippet } from './renderer/types';
import { UiUpdater } from './renderer/ui-updater';

// window["windowApi"] = windowApi;
const appApi = window["windowApi"] as API;

const inTxt$ = document.getElementById('in-txt') as any as HTMLTextAreaElement;
inTxt$.innerHTML = appApi.getSrcContent().join('\n');

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
    return appApi.getClipboard();
  }
});

// globalSnippetManager.addSnippet({
//   context: 'C++',
//   name: 'cout',
//   keycode: 'Numpad1',
//   shortcutLabel: '1',
//   snippet(text: string) {
//     return text.split('\n').filter(Boolean).map(line => this.perElement(line)).join('\n');
//   },
//   perElement(element: string) { // Forces cast, but keep it organized
//     return `cout << "${element}" << ${element} << endl;`;
//   }
// } as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'construct',
  keycode: 'Numpad2',
  shortcutLabel: '2',
  snippet(text: string) {
    return text.split('\n').filter(Boolean).map(line => this.perElement(line)).join('\n');
  },
  perElement(element: string) { // Forces cast, but keep it organized
    const [name, value] = element.replace(/^\s*\.|\,\s*$/g, '').split(' = ');
    return `${name}(${value}),`;
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'splog',
  keycode: 'Numpad3',
  shortcutLabel: '3',
  snippet(text: string) {
    return text.split('\n').filter(Boolean).map(line => this.perElement(line)).join('\n') + (text.endsWith('\n') ? '\n' : '');
  },
  perElement(element: string) { // Forces cast, but keep it organized
    // g_logFile.LogMessage(CLogFile::DETAIL,"... Merge attempt finished, there are %d visit types that have been left unassigned.\n", theseVisitTypes.GetCount());
    // g_GISLogFile.LogMessage(XMLtoSend1, "CEpiGisCore::GetDistanceArrayFromTD Input Request1:", CLogFile::DETAIL);
    return element
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:DETAIL,\s?/, `LOG_TRACE(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:DEBUG_1,\s?/, `LOG_DEBUG(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:MINOR,\s?/, `LOG_DEBUG(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:MAJOR,\s?/, `LOG_INFO(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:SEVERE,\s?/, `LOG_ERROR(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\(CLogFile\:\:CRITICAL,\s?/, `LOG_ERROR(logger, `)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:DETAIL/, `LOG_TRACE(logger, "$2 {}", $1$3`)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:DEBUG_1/, `LOG_DEBUG(logger, "$2 {}", $1$3`)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:MINOR/, `LOG_DEBUG(logger, "$2 {}", $1$3`)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:MAJOR/, `LOG_INFO(logger, "$2 {}", $1$3`)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:SEVERE/, `LOG_ERROR(logger, "$2 {}", $1$3`)
      .replace(/\w+\.?-?\>?LogMessage\((\w+)\, \"([^\"]+)\", (.*)CLogFile\:\:CRITICAL/, `LOG_ERROR(logger, "$2 {}", $1$3`)
      .replace(/\\n\"/g, '"')
      .replace(/%l?[a-z]/g, '{}')
      .replace(/%([0-9\.]+[a-z])/g, '{:$1}')
      .replace(/\.c_str\(\)/g, '');
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'attrInit',
  keycode: 'Numpad4',
  shortcutLabel: '4',
  snippet(text: string) {
    /* 
    return SolutionMetrics{
			.total_cost = 0,
			.bad_cluster_count = 0,
			.bad_cluster_cost = 0
		};
    */
    const lines = text.split('\n').filter(Boolean);
    const [opening, ...attributes] = lines;
    const ending = attributes.pop();
    const returns = opening.match('return');
    const openingType = opening.replace(/return /, '').replace(/\{/, '');
    const name = appApi.snakeCase(opening.match(/(\w+)\{/)[1]);
    const sets = attributes.map(attr => `${attr.replace(/^(\s*)/, `$1${name}`).replace(/,\s*$/, '')};`);
    return `${openingType} ${name};\n${sets.join('\n')}${returns ? `\nreturn ${name};` : ''}`;
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'const',
  keycode: 'Numpad5',
  shortcutLabel: '5',
  snippet(text: string) {
    const lines = text.split('\n').filter(Boolean);
    return lines.map(attr => `${attr.replace(/,\*$/, ``).replace(/\s*=\s*(.*)/, '($1)')}`).join(',\n');
  }
} as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'C++',
//   name: 'attributes',
//   keycode: 'Numpad6',
//   shortcutLabel: '6',
//   snippet(text: string) {
//     let out = "";
//     let level = 0;
//     for (let i = 0; i < text.length; i++) {
//       const c = text[i];
//       if (c==="<" || c==="(") {
//         level++;
//       }
//       if ((c===">" && text[i-1] !== '-') || c===")") {
//         level--;
//       }
//       if (level === 0 && c===",") {
//         out += ',\n';
//       } else {
//         out += c;
//       }
//     }
//     return '\t' + out.split('\n').map(s => s.replace(/^\s+/, '')).filter(Boolean).join('\n\t');
//   }
// } as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'C++',
//   name: 'import',
//   keycode: 'Numpad7',
//   shortcutLabel: '7',
//   snippet(text: string) {
//     const pieces = text.split(/\//).filter(Boolean);
//     return `#include <${pieces.slice(-2).join('/')}>`
//   }
// } as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'numbers to list',
//   keycode: 'Numpad7',
//   shortcutLabel: '7',07
//   snippet(text: string) {
//     const numbers = text.match(/\d+/g);
//     return numbers == null ? '' : numbers.map(n => `'${n}'`).join(', ');
//   }
// } as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'comma split',
//   keycode: 'Numpad6',
//   shortcutLabel: '6',
//   snippet(text: string) {
//     return text.replace(/(,|;)/g, '$1\n');
//   }
// } as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'repo',
//   keycode: 'Numpad6',
//   shortcutLabel: '6',
//   snippet(text: string) {
//     return text.split('\n').map(line => `ssh://git@prod-stash01:7999/${line.split('/').slice(1,3).join('/')}.git`).join('\n');
//   }
// } as Snippet);

globalSnippetManager.addSnippet({
  context: 'TS',
  name: 'split commas',
  keycode: 'Numpad1',
  shortcutLabel: '1',
  snippet(text: string) {
    return text.split(/,\s+/).filter(Boolean).join('\n');
  },
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'TS',
  name: 'javaClass',
  keycode: 'Numpad6',
  shortcutLabel: '6',
  snippet(text: string) {
    return text.replace(/\./g, '/');
  }
} as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'classVal props',
//   keycode: 'Numpad7',
//   shortcutLabel: '7',
//   snippet(text: string) {
//     const props = text.match(/(.*;)/g);
//     return props.map(prop => {
//       const [,name, set] = prop.match(/^\s*([A-Za-z]+)(.*)/);
//       return `${name}, /* ${set} */`
//     }).join('\n');
//   }
// } as Snippet);

globalSnippetManager.addSnippet({
  context: 'TS',
  name: 'classVal props (mock)',
  keycode: 'Numpad7',
  shortcutLabel: '7',
  snippet(text: string) {
    const props = text.match(/(.*;)/g);
    return props.map(prop => {
      const [,name, set] = prop.match(/^\s*([A-Za-z]+)(.*)/);
      const array = set.match(/Array\<([A-Za-z]+)\>/);
      if (array) {
        const [, val] = array;
        return `${name}: (ASD.${name} || []).map(mock${val}), /* ${set} */`
      }
      if (set.match(/ = /)) {
        const [, val] = set.match(/= ([^;]+);/);
        return `${name}: ASD.${name} ?? ${val}, /* ${set} */`
      }
      return `${name}: ASD.${name} ?? , /* ${set} */`
    }).join('\n');
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'TS',
  name: 'all-on-first',
  keycode: 'Numpad8',
  shortcutLabel: '8',
  snippet(text: string) {
    const [first, ...other] = text.split('\n').map(str => str.trim()).filter(Boolean);
    return other.map(item => `${item}: ${first}.${item},`).join('\n');
  }
} as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'maps',
//   keycode: 'Numpad8',
//   shortcutLabel: '8',
//   snippet(text: string) {
//     // 43.7380123,-79.4679253/43.7246462,-79.4319521/43.7026046,-79.4595639
//     return text.split('/')
//       .filter(latLon => latLon.match(/^\-?\d+\.?\d+\,\-?\d+\.?\d+$/))
//       .map(latLon => latLon.split(','))
//       .map(latLon => latLon.map(Number))
//       .map(([latitude, longitude]) => ({latitude, longitude}))
//       .map(v => JSON.stringify(v))
//       .join(',\n');
//   }
// } as Snippet);

// globalSnippetManager.addSnippet({
//   context: 'TS',
//   name: 'flip coords',
//   keycode: 'Numpad8',
//   shortcutLabel: '8',
//   snippet(text: string) {
//     const [lat, lon] = text.split(',');
//     return `${lon},${lat}`;
//   }
// } as Snippet);

globalSnippetManager.addSnippet({
  context: 'TS',
  name: 'jest',
  keycode: 'Numpad9',
  shortcutLabel: '9',
  snippet(text: string) {
    return text.split(/\n/)/* .filter(line => !line.match(/\s*\-/)) */.map(line =>
      line
        .replace(/(\s+)\+ /g, '$1')
        .replace(/(\s+)\- /g, '$1// ')
        .replace(/ Object|Object /g,'')
        .replace(/ Array|Array /g,'')
    ).join('\n');
  }
} as Snippet);