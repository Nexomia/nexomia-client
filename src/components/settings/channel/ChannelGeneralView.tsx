import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFilePicker } from 'use-file-picker';
import channelsService from '../../../services/api/channels/channels.service';
import FilesService from '../../../services/api/files/files.service';
import guildsService from '../../../services/api/guilds/guilds.service';
import GuildsService from '../../../services/api/guilds/guilds.service';
import $ChannelCacheStore, { cacheChannels } from '../../../store/ChannelCacheStore';
import $ChannelStore from '../../../store/ChannelStore';
import $GuildCacheStore, { cacheGuilds } from '../../../store/GuildCacheStore';
import DropdownKey from '../../interfaces/DropdownKey';
import DropdownInput from '../../ui/DropdownInput';
import FilledButton from '../../ui/FilledButton';
import InputField from '../../ui/InputField';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import MultilineField from '../../ui/MultilineField';
import StyledText from '../../ui/StyledText';
import Switch from '../../ui/Switch';
import BannerRenderer from '../BannerRenderer';

interface RouteParams {
  guildId: string
}

function ChannelGeneralView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const Channels = useStore($ChannelStore);
  const ChannelsCache = useStore($ChannelCacheStore);

  const { t } = useTranslation(['settings']);

  const [channelName, setChannelName] = useState('');
  const [topic, setTopic] = useState('');
  const [nsfw, setNsfw] = useState(false)
  const [timeout, setTimeout] = useState(false)
  const [edited, setEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [bannerEdited, setBannerEdited] = useState(false);
  const [avatarEdited, setAvatarEdited] = useState(false);

  const [openBannerPicker, bannerResult] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  const [openAvatarPicker, avatarResult] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  useEffect(() => {
    if (!bannerResult.loading && bannerResult.filesContent?.length) {
      setBannerEdited(true);
      setEdited(true);
    }

    if (!avatarResult.loading && avatarResult.filesContent?.length) {
      setAvatarEdited(true);
      setEdited(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerResult]);

  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { edited && <FilledButton onClick={ saveChanges }>{ t('save_changes') }</FilledButton> }
      <StyledText className={ css`text-align: left; margin: 4px; margin-top: 32px; font-size: 14px; font-weight: 900` }>
      { t('channel_general.channel_name') }
      </StyledText>
        <InputField
          className={
            css`
              margin-top: 4px;
              margin-bottom: 16px;
              font-weight: 900;
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
            `
          }
          defaultValue={ ChannelsCache[guildId]?.name }
          placeholder={ t('channel_general.channel_name') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setChannelName(event.target.value); setEdited(true) } }
        />
        <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
          { t('channel_general.channel_topic') }
        </StyledText>
        <MultilineField
          className={
            css`
              margin-top: 4px;
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
              height: 200px;
            `
          }
          defaultValue={ ChannelsCache[guildId]?.topic }
          placeholder={ t('channel_general.channel_topic_placeholder') }
          onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => { setTopic(event.target.value); setEdited(true) } }
        />
          <Fragment>
          <StyledText onClick={() => { setNsfw(!nsfw); setEdited(true) }} className={ css`text-align: left; margin: 4px; margin-top: 64px; font-size: 14px; font-weight: 900` }>
          { t('channel_general.nsfw') }<span className={css`display: inline-block; position: relative; top: -6px; float: right;`}><Switch active={ nsfw } /></span>
        </StyledText>
        </Fragment>
      <StyledText className={ css`text-align: left; margin: 4px; margin-top: 64px; font-size: 14px; font-weight: 900` }>
        { t('channel_general.channel_timeout') } 
      </StyledText>
      <InputField
          className={
            css`
              margin-top: 4px;
              margin-bottom: 16px;
              font-weight: 900;
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
            `
          }
          value={ ChannelsCache[guildId]?.topic }
          placeholder={ t('channel_general.channel_timeout_placeholder') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setChannelName(event.target.value); setEdited(true) } }
          type="number"
        />
    </Fragment>
  )

  async function saveChanges() {
    setSaveLoading(true);

    const channelPatch: any = {};

    if (channelName) channelPatch.name = channelName;
    if (topic) channelPatch.topic = topic;
    let response;
    if (ChannelsCache[guildId] && ChannelsCache[guildId].guild_id) response = await guildsService.patchChannel(ChannelsCache[guildId].guild_id || '', guildId, channelPatch);
    else response = await channelsService.patchChannel(guildId, channelPatch);

    cacheChannels([response]);

    setSaveLoading(false);
    setEdited(false);
  }
}

export default ChannelGeneralView;
