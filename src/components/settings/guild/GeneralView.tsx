import { useStore } from 'effector-react';
import { css } from 'linaria';
import { ChangeEvent, Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import GuildsService from '../../../services/api/guilds/guilds.service';
import $ChannelCacheStore from '../../../store/ChannelCacheStore';
import $ChannelStore from '../../../store/ChannelStore';
import $GuildCacheStore, { cacheGuilds } from '../../../store/GuildCacheStore';
import DropdownKey from '../../interfaces/DropdownKey';
import DropdownInput from '../../ui/DropdownInput';
import FilledButton from '../../ui/FilledButton';
import InputField from '../../ui/InputField';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import StyledText from '../../ui/StyledText';

interface RouteParams {
  guildId: string
}

function GeneralView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const Channels = useStore($ChannelStore);
  const ChannelsCache = useStore($ChannelCacheStore);

  const { t } = useTranslation(['settings']);

  const [guildAvatar, setGuildAvatar] = useState('');
  const [guildBanner, setGuildBanner] = useState('');
  const [guildName, setGuildName] = useState('');
  const [guildDefaultChannel, setGuildDefaultChannel] = useState('');
  const [edited, setEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { edited && <FilledButton onClick={ saveChanges }>{ t('save_changes') }</FilledButton> }
      <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
        { t('server_general.appearance') }
      </StyledText>
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.icon }
        placeholder={ t('server_general.icon_url') }
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildAvatar(event.target.value); setEdited(true) } }
      />
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.banner }
        placeholder={ t('server_general.banner_url') }
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildBanner(event.target.value); setEdited(true) } }
      />
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.name }
        placeholder={ t('server_general.name') }
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildName(event.target.value); setEdited(true) } }
      />
      <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
        { t('server_general.default_channel') }
      </StyledText>
      <DropdownInput
        keys={ [
          {
            id: '0',
            text: t('server_general.no_default_channel')
          },
          ...(
            Channels[guildId]?.map((channel) => ({
              id: channel,
              text: ChannelsCache[channel].name || ''
            })) ||
            []
          )
        ] }
        defaultKey={
          (Channels[guildId]?.indexOf(GuildsCache[guildId].default_channel || '') || -1) + 1
        }
        onChange={ (key: DropdownKey) => { setGuildDefaultChannel(key.id); setEdited(true) } }
      />
    </Fragment>
  )

  async function saveChanges() {
    setSaveLoading(true);

    const response = await GuildsService.patchGuild(guildId, {
      name: guildName,
      icon: guildAvatar,
      banner: guildBanner,
      default_channel: guildDefaultChannel
    })

    cacheGuilds([response]);

    setSaveLoading(false);
    setEdited(false);
  }
}

export default GeneralView;
