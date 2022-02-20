import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFilePicker } from 'use-file-picker';
import FilesService from '../../../services/api/files/files.service';
import UsersService from '../../../services/api/users/users.service';
import { setContextMenu } from '../../../store/ContextMenuStore';
import { setModalState } from '../../../store/ModalStore';
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

const tagExp = /^[a-z][a-z0-9]*$/;

function GeneralUserView() {
  const { t } = useTranslation(['settings']);

  const UserCache = useStore($UserStore);

  const [userName, setUserName] = useState('');
  const [tag, setTag] = useState(UserCache.discriminator);
  const [tagError, setTagError] = useState(false);
  const [password, sendPassword] = useState('');
  const [description, setDescription] = useState('');
  const [edited, setEdited] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [bannerEdited, setBannerEdited] = useState(false);
  const [avatarEdited, setAvatarEdited] = useState(false);
  const [preedited, setPreedited] = useState(false);

  const [openBannerPicker, bannerResult] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  const [openAvatarPicker, avatarResult] = useFilePicker({
    readAs: 'DataURL',
    accept: 'image/*'
  });

  useEffect(() => {
    setTag(tag.startsWith('#') ? tag.slice(1) : tag)
    if (
      !tagExp.test(tag) ||
      (tag.length > (UserCache.premium_type ? 7 : 4) || tag.length < (UserCache.premium_type ? 3 : 4) )
    ) setTagError(true)
    else setTagError(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    setTag(tag.startsWith('#') ? tag.slice(1) : tag)
    if (
      tag !== UserCache.discriminator &&
      (!tagExp.test(tag) ||
      (tag.length > (UserCache.premium_type ? 7 : 4) || tag.length < (UserCache.premium_type ? 3 : 4) ))
    ) setTagError(true)
    else setTagError(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tag]);

  useEffect(() => {
    if (password)
      saveChanges()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => {
    if (!bannerResult.loading && bannerResult.filesContent?.length && preedited) {
      setBannerEdited(true);
      setEdited(true);
    } else if (!avatarResult.loading && avatarResult.filesContent?.length && preedited) {
      setAvatarEdited(true);
      setEdited(true);
    } else if (!userName && !description && !tag) {
      setAvatarEdited(false);
      setBannerEdited(false);
      setEdited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bannerResult]);
  return (
    <Fragment>
      <LoadingPlaceholder title={ t('saving_changes') } active={ saveLoading } />
      { edited && <FilledButton onClick={ saveChanges }>{ t('save_changes') }</FilledButton> }
      <BannerRenderer
        avatar={ !avatarEdited ? UserCache.avatar || '' : avatarResult.filesContent[0]?.content || '' }
        banner={ !bannerEdited ? UserCache.banner || '' : bannerResult.filesContent[0]?.content || '' }
        letters={ UserCache.username || '' }
        onAvatarClick={ () => { openAvatarPicker(); setPreedited(true) } }
        onBannerClick={ () => { openBannerPicker(); setPreedited(true) } }
      />
      <BadgeContainer>
        <InputField
          className={
            css`
              display: inline-block;
              margin-top: -8px;
              margin-bottom: 16px;
              font-weight: 900;
              font-size: 22px;
              text-align: center;
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
            `
          }
          defaultValue={ UserCache.username }
          placeholder={ t('user_general.name') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setUserName(event.target.value); setEdited(true); } }
          minLength={1}
          maxLength={20}
        />
        <InputField
          className={
            classNames(
              css`
                display: inline-block;
                position: absolute;
                width: 128px;
                margin-top: -8px;
                margin-left: -128px;
                margin-bottom: 16px;
                font-weight: 900;
                font-size: 22px;
                text-align: center;
                background: transparent;
                border-color: transparent;
                color: var(--text-secondary);
                &.error {
                  border: 2px solid var(--text-negative);
                }
              `,
              { error: tagError }
            )
          }
          defaultValue={ '#' +  UserCache.discriminator }
          placeholder={ '#' + t('user_general.tag') }
          onChange={ (event: ChangeEvent<HTMLInputElement>) => { setTag(event.target.value); setEdited(true); } }
          minLength={UserCache.premium_type ? 4 : 5}
          maxLength={UserCache.premium_type ? 8 : 5}
        />
        <MultilineField
          className={
            css`
              background: var(--background-secondary);
              border: 2px solid var(--background-secondary);
              height: 200px;
            `
          }
          defaultValue={ UserCache.description }
          placeholder={ t('user_general.description') }
          onChange={ (event: ChangeEvent<HTMLTextAreaElement>) => { setDescription(event.target.value); setEdited(true) } }
        />
      </BadgeContainer>
    </Fragment>
  )

  async function saveChanges() {
    setSaveLoading(true);

    const userPatch: any = {};
    if ((userName || tag) && (!password || password === ''))  {
      setSaveLoading(false);
      setContextMenu({ id: '', data: { hook: sendPassword } });
       return setModalState({ passwordConfirmation: true });
    }
    else userPatch.password = password;
    if (userName) userPatch.username = userName;
    if (tag) userPatch.discriminator = tag;
    if (description) userPatch.description = description;

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

    const res = await UsersService.patchMe(userPatch);

    if (!res) setContextMenu({ data: { hook: sendPassword, error: true } })
    else setContextMenu({ data: { hook: sendPassword, ok: true } })

    setSaveLoading(false);
    setEdited(false);
    setPreedited(false);
    setAvatarEdited(false);
    setBannerEdited(false);
  }
}

export default GeneralUserView;
