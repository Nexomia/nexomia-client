import classNames from 'classnames';
import { useStore } from 'effector-react';
import { css } from 'linaria';
import $EmojiCacheStore from '../../../store/EmojiStore';
import { setModalState } from '../../../store/ModalStore';
import EmoteHoverEffect from '../../css/EmoteHoverEffect';

const EmoteImage = css`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: -3px 1px;
  transform: translateY(2px);
  padding: 4px;
  overflow: hidden;

  & > * {
    dispay: block;
    width: 40px;
    height: 40px;
    opacity: 0;
    overflow: hidden;
  }
`

interface EmojiProps {
  id: string,
  children?: any,
  attributes?: any,
  style?: any
}

function Emoji({ id, children = [], attributes = {}, style = {} }: EmojiProps) {
  const Emojis = useStore($EmojiCacheStore);

  return (
    <div
      { ...attributes }
      className={ classNames(EmoteImage, EmoteHoverEffect) }
      style={{ background: `url(${Emojis[id]?.url})`, backgroundSize: 'cover', ...style }}
      onClick={ () => setModalState({ emojiPack: [true, Emojis[id].pack_id] }) }
    >{ children }</div>
  )
}

export default Emoji;
