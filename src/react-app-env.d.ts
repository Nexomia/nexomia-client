
/// <reference types="react-scripts" />

declare module '*.opus' {
  const src: string;
  export default src;
}

declare module 'react-freezeframe';
declare module 'emojis-list';
declare module 'twemoji-basename';

// very genius move
// TODO: fix useParams later everywhere
declare module 'react-router' {
  export function useParams<Params extends { [K in keyof Params]?: string } = {}>(): Params;
}
