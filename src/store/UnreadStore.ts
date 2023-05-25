import { createStore, createEvent } from 'effector';

const addUnread = createEvent<UnreadEvent>();
const removeUnread = createEvent<UnreadEvent>();

interface Unreads {
  [key: string]: ChannelUnreads[];
}

interface ChannelUnreads {
  channel_id: string,
  message_ids: string[],
  last_message_id: string,
}

interface UnreadEvent {
  guildId: string,
  channelId: string,
  message_id: string,
  countable_ids?: string[],
  force?: boolean
}

const $UnreadStore = createStore<Unreads>({});

$UnreadStore
  .on(addUnread, (state, info: UnreadEvent) => {
    const modifiedState = { ...state };
    const index = modifiedState[info.guildId]?.findIndex(ch => ch.channel_id === info.channelId);

    if (modifiedState[info.guildId] && index + 1 && info.countable_ids) {
      modifiedState[info.guildId][index].last_message_id = info.message_id;
      modifiedState[info.guildId][index].message_ids = 
        modifiedState[info.guildId][index].message_ids
          .concat(info.countable_ids);
    } else {
      if (!modifiedState[info.guildId]) modifiedState[info.guildId] = [];

      modifiedState[info.guildId].push({
        channel_id: info.channelId,
        message_ids: [],
        last_message_id: info.message_id,
      });

      if (info.countable_ids) {
        modifiedState[info.guildId][modifiedState[info.guildId].length - 1].message_ids = info.countable_ids;
      }
    }
    
    return modifiedState;
  })
  .on(removeUnread, (state, info: UnreadEvent) => {
    const modifiedState = { ...state };
    const index = modifiedState[info.guildId].findIndex(ch => ch.channel_id === info.channelId);

    if (index + 1) {
      if (
        info.force ||
        (
          BigInt(info.message_id) >= BigInt(modifiedState[info.guildId][index].last_message_id) &&
          !modifiedState[info.guildId][index].message_ids.length
        )
      ) {
        modifiedState[info.guildId].splice(index, 1);
        if (!Object.entries(modifiedState[info.guildId]).length) {
          delete modifiedState[info.guildId];
        }
      } else if (modifiedState[info.guildId][index].message_ids.includes(info.message_id)) {
        modifiedState[info.guildId][index].message_ids = 
          modifiedState[info.guildId][index].message_ids
            .filter((msg) => msg > info.message_id);
      } else return;
    }

    return modifiedState;
  });

export default $UnreadStore;
export { addUnread, removeUnread };
