import { createStore, createEvent } from 'effector';

const setGuilds = createEvent<Guild[]>();
const addGuild = createEvent<Guild>();

interface Guild {
  id: string,
  name: string,
  icon: string
}

const $GuildStore = createStore<Guild[]>([]);

$GuildStore
  .on(setGuilds, (state, guilds: Guild[]) => guilds)
  .on(addGuild, (state, guild: Guild) => ([...state, guild]));

export default $GuildStore;
export { setGuilds, addGuild };
