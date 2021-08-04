import MessageInfo from './MessageInfo';

export default interface CustomMessageEvent extends MessageEvent {
  info: MessageInfo
}
