import styled from "@emotion/styled"
import { color } from "../tokens"

const StyledIcon = styled.i({
  animationName: 'spin',
  animationDuration: '3000ms',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  color: color.text,
})

export const Spinner = () => {
  return <StyledIcon className="fa-solid fa-spinner" />
}