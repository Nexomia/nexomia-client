import Attachment from './Attachment';
import Reaction from './Reaction';
import Embed from './Embed';

export default interface Message {
  id: string;
  type: number;
  channel_id: string;
  author: string;
  content?: string;
  created: number;
  edited: boolean;
  edit_time?: number | null;
  edit_history?: Message[] | null;
  attachments?: Attachment[] | null;
  resentIds?: string[] | null;
  resentRevs?: string[] | null;
  reactions?: Reaction[] | null;
  mentions?: string[] | null;
  sticker?: string;
  deleted: boolean;
  embeds?: Embed[] | null;
}
