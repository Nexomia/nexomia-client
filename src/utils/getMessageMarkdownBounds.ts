import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

export default function getMessageMarkdownBounds(content: string, path?: any): any {
  const ranges = [];

  function getLength(token: any) {
    if (typeof token === 'string') {
      return token.length;
    } else if (typeof token.content === 'string') {
      return token.content.length;
    } else {
      return token.content.reduce((l: string, t: string) => l + getLength(t), 0);
    }
  }

  const tokens = Prism.tokenize(content, Prism.languages.markdown);
  let start = 0;

  for (const token of tokens) {
    const length = getLength(token);
    const end = start + length;

    if (typeof token !== 'string') {
      if (path) {
        ranges.push({
          type: token.type,
          anchor: { path, offset: start },
          focus: { path, offset: end }
        });
      } else {
        ranges.push({
          type: token.type,
          start,
          length: end
        });
      }
    }

    start = end;
  }

  return ranges;
}
