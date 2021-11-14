import Attachment from './Attachment';
import Reaction from './Reaction';
import Embed from './Embed';
import User from './User';
import Emoji from './Emoji';

export default interface Message {
  id: string;
  type: number;
  channel_id: string;
  author: string;
  user?: User;
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
  sticker?: Emoji;
  deleted: boolean;
  embeds?: Embed[] | null;
  forwarded_ids: string[];
  forwarded_messages: Message[]
}
