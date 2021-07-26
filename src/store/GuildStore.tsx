import { createStore, createEvent } from 'effector-root';

const setGuilds = createEvent<string[]>();
const addGuild = createEvent<string>();

const $GuildStore = createStore<string[]>([]);

$GuildStore
  .on(setGuilds, (state, guilds: string[]) => guilds)
  .on(addGuild, (state, guild: string) => ([...state, guild]));

export default $GuildStore;
export { setGuilds, addGuild };
