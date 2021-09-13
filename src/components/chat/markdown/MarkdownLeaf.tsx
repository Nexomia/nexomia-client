import { Fragment } from 'react';


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
      : <span { ...attributes }>{ children }</span> }
    </Fragment>
  )
}

export default MarkdownLeaf;
