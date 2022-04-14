import { createStore, createEvent } from 'effector-root';

const setGuilds = createEvent<string[]>();
const addGuild = createEvent<string>();
const removeGuild = createEvent<string>();

const $GuildStore = createStore<string[]>([]);

$GuildStore
  .on(setGuilds, (state, guilds: string[]) => guilds)
  .on(addGuild, (state, guild: string) => ([...state, guild]))
  .on(removeGuild, (state, guild: string) => {
    const modifiedState = [ ...state ];
    modifiedState.splice(modifiedState.indexOf(guild), 1);

    return modifiedState;
  });

export default $GuildStore;
export { setGuilds, addGuild, removeGuild };
