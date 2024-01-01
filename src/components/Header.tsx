import styled from "@emotion/styled";
import { color } from "../tokens";

const StyledHeaderWrapper = styled.div({
  borderBottom: `1px ${color.border} solid`,
  textAlign: 'left',
  padding: '8px 16px',
  color: color["text-dark"],
  fontSize: '18px',
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
  ' > *': {
    flex: '0 0 auto'
  }
})

export const Header = () => {
  return (
    <StyledHeaderWrapper>
      <span>Adaptive</span>
      <span>{'>'}</span> 
      <span>Loss Chart</span>
    </StyledHeaderWrapper>
  );
}