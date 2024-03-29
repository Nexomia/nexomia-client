import { css } from 'linaria';
import getMessageMarkdownBounds from './getMessageMarkdownBounds';
import { parse } from 'twemoji-parser';
import emojis from 'emojibase-data/en/data.json';
import Emoji from '../components/chat/markdown/Emoji';
import $EmojiCacheStore from '../store/EmojiStore';
import '../styles/prism-nord.css'
const Markdown = require('react-markdown-it') //fix later

const EmoteImage = css`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: -3px 1px;
  transform: translateY(2px);
  padding: 4px;
  overflow: hidden;
`
const urlExp = /(http:\/\/|https:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)?/gm;

export default function renderMessageContent(content: string) {

  content = content.replace(urlExp, (url) => { return `[${url.startsWith('http') ? url : 'https://' + url}](${url})` })

  const output = [];
  const bounds = getMessageMarkdownBounds(content);

  let latestStart = 0;

  let optimizeEmojiSliced: any;

  for (const bound of bounds) {
    output.push(content.slice(latestStart, bound.start));

    switch (bound.type) {
      case 'url':
        const link = content.slice(bound.start + 1, bound.length).split(']')[0]
        const text = content.slice(bound.start, bound.length - 1).split('(')[1]
        output.push(
          <a href={ link } target="_blank" rel="noreferrer">{ text }</a>
        );
        
        break;
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
        const lang = content.slice(bound.start + 3, bound.length - 3).trim().split('\n')[0].split(' ')[0]
        output.push(
          <code className={ `language-${lang}`} style={{ display: 'block', padding: '12px' }}>{ content.slice(bound.start + 3 + lang.length, bound.length - 3).trim() }</code>
        );
        break;

      case 'tag':
        let optimizeParsed: any = null;
        if (
          (
            content.slice(bound.start, bound.length).startsWith('<i')
          ) &&
          (optimizeParsed = parse(
            emojis.find((e: any) => e?.label === content.slice(bound.start, bound.length)?.split(':')[1]?.split('>')[0])?.emoji || ''
          ))
        ) {
          output.push(
            <div className={ EmoteImage } style={{
              background: `url(${optimizeParsed[0]?.url})`,
              ...(
                bounds[0].start !== 0 || (bounds[bounds.length - 1].start + bounds[bounds.length - 1].length) < content.length ? {} : {
                  width: '40px',
                  height: '40px'
                }
              )
            }} />
          )
        } else if (
          content.slice(bound.start, bound.length).startsWith('<e') &&
          $EmojiCacheStore.getState()[optimizeEmojiSliced = content.slice(bound.start, bound.length)?.split(':')[1]?.split('>')[0]]
        ) {
          output.push(
            <Emoji
              id={ optimizeEmojiSliced }
              style={
                bounds[0].start !== 0 || (bounds[bounds.length - 1].start + bounds[bounds.length - 1].length) < content.length ? {} : {
                  width: '40px',
                  height: '40px'
                }
              }
            />
          )
        } else {
          output.push(content.slice(bound.start, bound.length));
        }
        break;
    
      default:
        output.push(content.slice(bound.start, bound.length));
        break;
    }

    latestStart = latestStart + bound.length;
  }
  output.push(content.slice(latestStart));

  return output;
}
