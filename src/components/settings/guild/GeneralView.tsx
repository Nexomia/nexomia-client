import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useFilePicker } from 'use-file-picker';
import FilesService from '../../../services/api/files/files.service';
import GuildsService from '../../../services/api/guilds/guilds.service';
import $ChannelCacheStore from '../../../store/ChannelCacheStore';
import $ChannelStore from '../../../store/ChannelStore';
import $GuildCacheStore, { cacheGuilds } from '../../../store/GuildCacheStore';
import DropdownKey from '../../interfaces/DropdownKey';
import DropdownInput from '../../ui/DropdownInput';
import FilledButton from '../../ui/FilledButton';
import InputField from '../../ui/InputField';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import MultilineField from '../../ui/MultilineField';
import StyledText from '../../ui/StyledText';
import BannerRenderer from '../BannerRenderer';

interface RouteParams {
  guildId: string
}

const BadgeContainer = styled.div`
  padding: 80px 16px 16px 16px;
  background: var(--background-secondary-alt);
  border-radius: 0 0 8px 8px;
  margin-top: -64px;
  margin-bottom: 32px;
`

function GeneralView() {
  const { guildId } = useParams<RouteParams>();
  const GuildsCache = useStore($GuildCacheStore);
  const Channels = useStore($ChannelStore);
  const ChannelsCache = useStore($ChannelCacheStore);

  const { t } = useTranslation(['settings']);

  const [guildName, setGuildName] = useState('');
  const [guildDefaultChannel, setGuildDefaultChannel] = useState('');
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
      <BannerRenderer
        avatar={ !avatarEdited ? GuildsCache[guildId]?.icon || '' : avatarResult.filesContent[0]?.content || '' }
        banner={ !bannerEdited ? GuildsCache[guildId]?.banner || '' : bannerResult.filesContent[0]?.content || '' }
        letters={ GuildsCache[guildId]?.name || '' }
        onAvatarClick={ () => openAvatarPicker() }
        onBannerClick={ () => openBannerPicker() }
      />
      { /* <InputField
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
      /> */ }
      <BadgeContainer>
        <InputField
          className={
            css`
              margin-top: -8px;
              margin-bottom: 16px;
              font-weight: 900;
              font-size: 22px;
              text-align: center;
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);

              &:not(:hover):not(:focus) {
                background: transparent;
                border-color: transparent;
              }
            `
          }
          defaultValue={ GuildsCache[guildId]?.name }
          placeholder={ t('server_general.name') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setGuildName(event.target.value); setEdited(true) } }
        />
        <MultilineField
          className={
            css`
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
              height: 200px;
            `
          }
          defaultValue={ '' }
          placeholder={ t('server_general.description') }
        />
      </BadgeContainer>
      <StyledText className={ css`text-align: left; margin: 4px; font-size: 14px; font-weight: 900` }>
        { t('server_general.default_channel') }
      </StyledText>
      <DropdownInput
        noMargin
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

    const guildPatch: any = {};

    if (guildName) guildPatch.name = guildName;
    if (guildDefaultChannel) guildPatch.default_channel = guildDefaultChannel;

    if (avatarEdited) {
      const uploadUrl = await FilesService.createFile(2);
      const fileInfo = await FilesService.uploadFile(uploadUrl, avatarResult.plainFiles[0]);

      guildPatch.icon = fileInfo.id;
    }

    if (bannerEdited) {
      const uploadUrl = await FilesService.createFile(3);
      const fileInfo = await FilesService.uploadFile(uploadUrl, bannerResult.plainFiles[0]);

      guildPatch.banner = fileInfo.id;
    }

    const response = await GuildsService.patchGuild(guildId, guildPatch);

    cacheGuilds([response]);

    setSaveLoading(false);
    setEdited(false);
    setAvatarEdited(false);
    setBannerEdited(false);
  }
}

export default GeneralView;
