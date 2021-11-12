import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilePicker } from 'use-file-picker';
import FilesService from '../../../services/api/files/files.service';
import UsersService from '../../../services/api/users/users.service';
import $UserStore from '../../../store/UserStore';
import FilledButton from '../../ui/FilledButton';
import InputField from '../../ui/InputField';
import LoadingPlaceholder from '../../ui/LoadingPlaceholder';
import MultilineField from '../../ui/MultilineField';
import BannerRenderer from '../BannerRenderer';

const BadgeContainer = styled.div`
  padding: 80px 16px 16px 16px;
  background: var(--background-secondary-alt);
  border-radius: 0 0 8px 8px;
  margin-top: -64px;
  margin-bottom: 32px;
`

function GeneralUserView() {
  const { t } = useTranslation(['settings']);

  const UserCache = useStore($UserStore);

  const [userName, setUserName] = useState('');
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
  }, [bannerResult]);

  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { edited && <FilledButton onClick={ saveChanges }>{ t('save_changes') }</FilledButton> }
      <BannerRenderer
        avatar={ !avatarEdited ? UserCache.avatar || '' : avatarResult.filesContent[0]?.content || '' }
        banner={ !bannerEdited ? UserCache.banner || '' : bannerResult.filesContent[0]?.content || '' }
        letters={ UserCache.username || '' }
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
              border: var(--background-secondary);

              &:not(:hover):not(:focus) {
                background: transparent;
                border-color: transparent;
              }
            `
          }
          defaultValue={ UserCache.username }
          placeholder={ t('server_general.name') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setUserName(event.target.value); setEdited(true) } }
        />
        <MultilineField
          className={
            css`
              background: var(--background-secondary);
              height: 200px;
            `
          }
          defaultValue={ '' }
          placeholder={ t('user_general.description') }
        />
      </BadgeContainer>
    </Fragment>
  )

  async function saveChanges() {
    setSaveLoading(true);

    const userPatch: any = {};

    if (userName) userPatch.username = userName;

    if (avatarEdited) {
      const uploadUrl = await FilesService.createFile(2);
      const fileInfo = await FilesService.uploadFile(uploadUrl, avatarResult.plainFiles[0]);

      userPatch.avatar = fileInfo.id;
    }

    if (bannerEdited) {
      const uploadUrl = await FilesService.createFile(3);
      const fileInfo = await FilesService.uploadFile(uploadUrl, bannerResult.plainFiles[0]);

      userPatch.banner = fileInfo.id;
    }

    await UsersService.patchMe(userPatch);

    setSaveLoading(false);
    setEdited(false);
    setAvatarEdited(false);
    setBannerEdited(false);
  }
}

export default GeneralUserView;
