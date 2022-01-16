import User from "./User";

export default interface GuildBan {
  user_id: string,
  reason: string,
  banned_by: string,
  date: number,
  users: User[]
}
