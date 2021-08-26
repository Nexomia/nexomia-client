import getMessageMarkdownBounds from './getMessageMarkdownBounds';

export default function renderMessageContent(content: string) {
  const output = [];
  const bounds = getMessageMarkdownBounds(content);
  let latestStart = 0;
  let latestLength = 0;

  for (const bound of bounds) {
    output.push(content.slice(latestStart, bound.start));

    switch (bound.type) {
      case 'bold':
        output.push(
          <b>{ content.slice(bound.start + 2, bound.length - 2) }</b>
        );
        break;
      
      case 'italic':
        output.push(
          <i>{ content.slice(bound.start + 1, bound.length - 1) }</i>
        );
        break;

      case 'strike':
        output.push(
          <s>{ content.slice(bound.start).startsWith('~~') 
            ? content.slice(bound.start + 2, bound.length - 2)
            : content.slice(bound.start + 1, bound.length - 1) }</s>
        );
        break;

      case 'title':
        output.push(
          <h2>{ content.slice(bound.start + 1, bound.length).trim() }</h2>
        );
        break;

      case 'code-snippet':
        output.push(
          <code>{ content.slice(bound.start + 1, bound.length - 1).trim() }</code>
        );
        break;

      case 'code':
        output.push(
          <code style={{ display: 'block', padding: '12px' }}>{ content.slice(bound.start + 3, bound.length - 3).trim() }</code>
        );
        break;
    
      default:
        output.push(content.slice(bound.start, bound.length));
        break;
    }

    latestStart = bound.start + bound.length;
  }

  output.push(content.slice(latestStart));

  return output;
}
