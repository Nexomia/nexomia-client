import { htmlEscape } from 'escape-goat';
import markdown from 'snarkdown';

export default function renderMessageContent(content: string) {
  const rendered = markdown(htmlEscape(content));

  console.log(rendered)

  return rendered;
}
