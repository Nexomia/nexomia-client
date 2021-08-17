import { useStore } from 'effector-react';
import { css } from 'linaria';
import { ChangeEvent, Fragment, useState } from 'react';
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

  const [guildAvatar, setGuildAvatar] = useState('');
  const [guildBanner, setGuildBanner] = useState('');
  const [guildName, setGuildName] = useState('');
  const [guildDefaultChannel, setGuildDefaultChannel] = useState('');
  const [edited, setEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  return (
    <Fragment>
      <LoadingPlaceholder title="Saving Changes..." active={ saveLoading } />
      { edited && <FilledButton onClick={ saveChanges }>Save Changes</FilledButton> }
      <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
        Appearance
      </StyledText>
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.icon }
        placeholder='Server Icon URL (leave empty to remove)'
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildAvatar(event.target.value); setEdited(true) } }
      />
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.banner }
        placeholder='Server Banner URL (leave empty to remove)'
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildBanner(event.target.value); setEdited(true) } }
      />
      <InputField
        className={ css`margin-top: 2px; margin-bottom: 16px` }
        defaultValue={ GuildsCache[guildId]?.name }
        placeholder='Server Name'
        onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildName(event.target.value); setEdited(true) } }
      />
      <StyledText className={ css`text-align: center; margin: 48px 0 24px 0; font-size: 22px; font-weight: 900` }>
        Default Channel
      </StyledText>
      <DropdownInput
        keys={ [
          {
            id: '0',
            text: 'No default channel'
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
