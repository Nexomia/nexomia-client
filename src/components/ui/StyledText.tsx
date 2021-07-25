import { styled } from 'linaria/react';

const StyledText = styled.div`
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
  user-select: none;

  & > a {
    color: var(--accent);
  }
`

export default StyledText;
