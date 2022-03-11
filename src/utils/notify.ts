import UIfx from 'uifx';

import messageAsset from '../assets/sounds/message.opus';

const messageSound = new UIfx(messageAsset);

interface NotifyProps {
  title: string,
  content: string,
  image: string,
  type: NotifyType,
  sound?: boolean
}

export enum NotifyType {
  NEW_MESSAGE = 1
}

export default function notify({ title, content, image, type, sound = true }: NotifyProps) {
  new Notification(title, { body: content, image });
  if (type === NotifyType.NEW_MESSAGE && sound)
    messageSound.play();
}
