import styled from "@emotion/styled"
import { AxisRange } from "../../../types"
import { AxisRangeSetting } from "./AxisRangeSetting"
import { color } from "../../../tokens"

const StyledWrapper2 = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  borderLeft: `1px ${color.border} solid`,
  flex: '0 0 180px',
  textAlign: 'left'
})

const StyledLabel = styled.span({
  textAlign: 'left',
  color: color["text-dark"],
  fontSize: '16px'
})

export const TokenLossChartSettings = ({onApplyXRange, onApplyYRange}: {onApplyXRange: (range: AxisRange) => void, onApplyYRange: (range: AxisRange) => void}) => {
  return (
    <StyledWrapper2>
      <StyledLabel>X Axis</StyledLabel>
      <AxisRangeSetting onApplyRange={onApplyXRange} />
      <StyledLabel>Y Axis</StyledLabel>
      <AxisRangeSetting onApplyRange={onApplyYRange} />
    </StyledWrapper2>
  )
}