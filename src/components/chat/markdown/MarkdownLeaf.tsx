import { Fragment } from 'react';
import { css } from 'linaria';

import { parse } from 'twemoji-parser';
import emojis from 'emojibase-data/en/data.json';
import Emoji from './Emoji';

const EmoteImage = css`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: -3px 1px;
  transform: translateY(2px);
  padding: 4px;
  overflow: hidden;

  & > * {
    dispay: block;
    width: 40px;
    height: 40px;
    opacity: 0;
    overflow: hidden;
  }
`

let optimizeParsed: any = null;

function MarkdownLeaf({ attributes, children, leaf }: any) {
  return (
    <Fragment>
      { leaf.type === 'bold'
      ? (
        <b { ...attributes }>{ children }</b>
      )
      : leaf.type === 'italic'
      ? (
        <i { ...attributes }>{ children }</i>
      )
      : leaf.type === 'strike'
      ? (
        <s { ...attributes }>{ children }</s>
      )
      : leaf.type === 'title' ? (
        <h2 { ...attributes }>{ children }</h2>
      )
      : leaf.type === 'code-snippet' ? (
        <code { ...attributes }>{ children }</code>
      )
      : leaf.type === 'code'
      ? (
        <code style={{ display: 'block', padding: '12px' }} { ...attributes }>{ children }</code>
      )
      : leaf.type === 'tag' &&
        leaf.text.startsWith('<i') &&
        (optimizeParsed = parse(
          emojis.find((e: any) => e?.label === leaf.text.split(':')[1].split('>')[0])?.emoji || ''
        ))
      ? (
        <div { ...attributes } className={ EmoteImage } style={{ background: `url(${optimizeParsed[0]?.url})` }}>{ children }</div>
      )
      : leaf.type === 'tag' &&
        leaf.text.startsWith('<e')
      ? (
        <Emoji
          attributes={ attributes }
          children={ children }
          id={ leaf.text.split(':')[1].split('>')[0] }
        />
      ) : <span { ...attributes }>{ children }</span> }
    </Fragment>
  )
}

export default MarkdownLeaf;
