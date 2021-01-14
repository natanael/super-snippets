import { windowApi } from './api.type'
import { SnippetManager } from './renderer/snippet-manager';
import { Snippet } from './renderer/types';
import { UiUpdater } from './renderer/ui-updater';

const inTxt$ = document.getElementById('in-txt') as any as HTMLTextAreaElement;
inTxt$.innerHTML = windowApi.getSrcContent().join('\n');

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
    return windowApi.getClipboard();
  }
});

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'cout',
  keycode: 'Numpad1',
  shortcutLabel: '1',
  snippet(text: string) {
    return text.split('\n').filter(Boolean).map(line => this.perElement(line)).join('\n');
  },
  perElement(element: string) { // Forces cast, but keep it organized
    return `cout << "${element}" << ${element} << endl;`;
  }
} as Snippet);

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
    const name = windowApi.snakeCase(opening.match(/(\w+)\{/)[1]);
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

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'attributes',
  keycode: 'Numpad6',
  shortcutLabel: '6',
  snippet(text: string) {
    let out = "";
    let level = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c==="<" || c==="(") {
        level++;
      }
      if ((c===">" && text[i-1] !== '-') || c===")") {
        level--;
      }
      if (level === 0 && c===",") {
        out += ',\n';
      } else {
        out += c;
      }
    }
    return '\t' + out.split('\n').map(s => s.replace(/^\s+/, '')).filter(Boolean).join('\n\t');
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'import',
  keycode: 'Numpad7',
  shortcutLabel: '7',
  snippet(text: string) {
    const pieces = text.split(/\//).filter(Boolean);
    return `#include <${pieces.slice(-2).join('/')}>`
  }
} as Snippet);

globalSnippetManager.addSnippet({
  context: 'C++',
  name: 'logger',
  keycode: 'Numpad8',
  shortcutLabel: '8',
  snippet(text: string) {
    const pieces = text.split(/\//).filter(Boolean);
    const name = pieces.slice(-2).join('/').replace(/\.[a-z]+$/, '');
    return `namespace {
auto logger = spdlog::stdout_color_mt("${name}");
} // namespace`
  }
} as Snippet);

