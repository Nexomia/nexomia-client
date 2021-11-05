import classNames from 'classnames';
import { styled } from 'linaria/react';

import LogoImage from '../../assets/graphics/brand/logo.svg';

const Container = styled.div`
  width: 160px;
  height: 160px;
  position: relative;
  animation: logoc .4s;

  @keyframes logoc {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }

    to {
      transform: translateY(10px);
      opacity: .5;
    }

    to {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`

const AnimationContainer = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  animation: logobg .8s infinite;

  @keyframes logobg {
    from {
      transform: rotate(0deg)
    }

    to {
      transform: rotate(90deg)
    }
  }
`

const LogoBackground = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 20px;
  background: var(--background-primary);
  transition: .6s;
  transform: scale(1);

  &.scale {
    transform: scale(25);
  }
`

const Logo = styled.img`
  display: block;
  width: 160px;
  height: 160px;
  position: absolute;
  animation: logo .4s;

  @keyframes logo {
    from {
      transform: rotate(20deg) translateY(80px);
      opacity: 0;
    }

    to {
      transform: rotate(0deg) translateY(0px);
      opacity: 1;
    }
  }
`

interface BrandProps {
  inactive: boolean
}

function Brand({ inactive }: BrandProps) {
  return (
    <Container>
      <AnimationContainer>
        <LogoBackground className={ classNames({ scale: inactive }) } />
      </AnimationContainer>
      <Logo src={ LogoImage } />
    </Container>
  );
}

export default Brand;
