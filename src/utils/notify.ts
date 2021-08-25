import UIfx from 'uifx';

import messageAsset from '../assets/sounds/message.opus';

const messageSound = new UIfx(messageAsset);

interface NotifyProps {
  title: string,
  content: string,
  image: string,
  type: number
}

export default function notify({ title, content, image, type }: NotifyProps) {
  new Notification(title, { body: content, image });
  messageSound.play();
}
