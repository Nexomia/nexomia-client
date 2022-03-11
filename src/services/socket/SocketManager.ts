import config from '../../config';

import CommonRequestManager from '../api/common';

import CustomMessageEvent from './models/CustomMessageEvent';

import MesssageEventHandler from './events/Messages';
import UserEventHandler from './events/Users';
import RoleEventHandler from './events/Roles';
import ChannelEventHandler from './events/Channels';
import GuildEventHandler from './events/Guilds';
import { Dispatch, SetStateAction } from 'react';

class SocketManager {
  public socket: WebSocket | null = null;
  private token: string = '';
  private setLoaded: any;

  public onLoad = () => {};

  private checkConnection = () => {
      this.socket = new WebSocket(config.socket.url + `?token=`);
      this.socket.addEventListener('open', () => {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      });

      this.socket.addEventListener('error', () => {
        setTimeout(this.checkConnection, 3000);
      });
  }
  
  setToken(token: string) {
    this.token = token;
  }

  init(loading?: Dispatch<SetStateAction<boolean>>) {
    this.setLoaded = loading
    if (this.token && this.token !== '' && !this.socket) {
      this.socket = new WebSocket(config.socket.url + `?token=${this.token}`);

      this.socket.addEventListener('open', () => {
        this.initEventListeners();
        setInterval(() => { this.socket?.send('{"event": "Ping!"}') }, 30000);
      });
    }
  }

  initEventListeners() {
    this.socket?.addEventListener('message', (event: MessageEvent) => {
      const eventData: CustomMessageEvent = {
        ...event,
        info: JSON.parse(event.data)
      };

      this.handleEvent(eventData);
    });

    this.socket?.addEventListener('close', () => {
      this.setLoaded(false);
      this.checkConnection();
      this.socket = null;
    });
  }

  async handleEvent(event: CustomMessageEvent) {
    switch (event.info.event) {
      case 'auth.warning':
        const newToken = await CommonRequestManager.refreshToken();
        this.socket?.send(
          JSON.stringify(
            {
              event: 'auth.refresh_token',
              data: {
                authorization: newToken
              }
            }
          )
        );
        break;

      case 'auth.succeed':
        this.onLoad();
        break;

      case 'message.created':
        MesssageEventHandler.messageCreated(event);
        break;

      case 'message.deleted':
        MesssageEventHandler.messageDeleted(event);
        break;

      case 'message.pinned':
        MesssageEventHandler.messagePinned(event);
        break;

      case 'user.connected':
        UserEventHandler.userConnected(event);
        break

      case 'user.disconnected':
        UserEventHandler.userDisconnected(event);
        break

      case 'user.patched':
        UserEventHandler.userPatched(event);
        break

      case 'guild.role_patched':
        RoleEventHandler.rolePatched(event);
        break;

      case 'guild.role_created':
        RoleEventHandler.roleCreated(event);
        RoleEventHandler.rolePatched(event);
        break;

      case 'guild.channel_created':
        ChannelEventHandler.channelCreated(event);
        break;

      case 'guild.channel_deleted':
        ChannelEventHandler.channelDeleted(event);
        break;

      case 'guild.channel_permission_overwrite':
        GuildEventHandler.channelPermissionOverwrite(event);
        break;

      case 'guild.user_joined':
        GuildEventHandler.memberJoined(event);
        break;

      case 'guild.user_left':
        GuildEventHandler.memberLeft(event);
        break;

      case 'channel.typing':
        ChannelEventHandler.channelTyping(event);
        break;
    }
  }
}

export default new SocketManager();
