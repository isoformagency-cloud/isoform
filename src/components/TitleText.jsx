import { Fragment } from 'react';

// Headings are written as plain strings, with *asterisks* around the words set
// in the serif accent: "Five crafts, *one team.*"
const parse = (text) =>
  text
    .split('*')
    .map((segment, index) => ({ accent: index % 2 === 1, words: segment.trim().split(/\s+/).filter(Boolean) }))
    .filter((segment) => segment.words.length > 0);

const Accent = ({ children }) => <em className="serif-accent text-brand-200">{children}</em>;

// Static version, for headings revealed as a whole.
export function Title({ text }) {
  return parse(text).map((segment, index) => (
    <Fragment key={index}>
      {index > 0 ? ' ' : null}
      {segment.accent ? <Accent>{segment.words.join(' ')}</Accent> : segment.words.join(' ')}
    </Fragment>
  ));
}

// One word that rises into place. `i` staggers it against its neighbours.
export function Rise({ i = 0, children }) {
  return (
    <span className="rise">
      <span style={{ '--i': i }}>{children}</span>
    </span>
  );
}

// Animated version for page titles: each word rises in turn on load.
export function TitleText({ text, start = 0 }) {
  let i = start;
  return parse(text).map((segment, index) => {
    const words = segment.words.map((word, w) => (
      <Fragment key={w}>
        {w > 0 ? ' ' : null}
        <Rise i={i++}>{word}</Rise>
      </Fragment>
    ));
    return (
      <Fragment key={index}>
        {index > 0 ? ' ' : null}
        {segment.accent ? <Accent>{words}</Accent> : words}
      </Fragment>
    );
  });
}

export const plainTitle = (text) => text.replaceAll('*', '');
