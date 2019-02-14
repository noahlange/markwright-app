import { highlightAuto } from 'highlight.js';
import { expose } from 'workly/index';

function highlight(str: string, lang: string) {
  return highlightAuto(str, [lang]).value;
}

expose(highlight);
