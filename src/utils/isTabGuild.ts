export default function isTabGuild(id: string) {
  return id !== '@me' && id !== '@home' && id !== '@discover' && id !== '@profiles';
}
