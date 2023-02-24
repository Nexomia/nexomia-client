import classNames from 'classnames';
import { css } from 'linaria';
import { styled } from 'linaria/react';
import { useTranslation } from 'react-i18next';
import { RiArrowRightSLine } from 'react-icons/ri';
import StyledIconCss from '../../css/StyledIconCss';
import StyledText from '../../ui/StyledText';


const Container = styled.div`
  padding: 16px;
  border-radius: 4px;
  background: var(--background-secondary-alt);
  margin: 4px 0;
  display: flex;
  flex-grow: 1;
  flex-direction: row;
  align-items: center;

  &:not(.active):hover {
    cursor: pointer;
    background: var(--background-secondary);
  }
`

const ColorDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 16px;
`

const Splitter = styled.div`
  flex-grow: 1;
`

const DefaultIconCss = css`
  padding: 2px 4px;
  border-radius: 2px;
  background: var(--accent);
  margin: 0;
  font-size: 14px;
`

const IconCss = css`
  width: 20px;
  height: 20px;
  margin-left: 16px;
`

interface RoleProps {
  name: string,
  color: string,
  defaultRole: boolean,
  onClick?: any,
  active?: boolean,
  noArrow?: boolean,
  ref?: any
}

function Role({ name, color, defaultRole, onClick, active = false, noArrow = false, ref }: RoleProps) {
  const { t } = useTranslation(['settings']);

  return (
    <Container onClick={ onClick } className={ classNames({ active }) } ref={ ref }>
      <ColorDot style={{ background: color }} />
      <StyledText className={ css`margin: 0; font-weight: 900` }>{ name }</StyledText>
      <Splitter />
      { defaultRole && (<StyledText className={ DefaultIconCss }>{ t('server_roles.default_role') }</StyledText>) }
      { !active && !noArrow && (<RiArrowRightSLine className={ classNames({ [StyledIconCss]: true, [IconCss]: true }) } />) }
    </Container>
  )
}

export default Role;
