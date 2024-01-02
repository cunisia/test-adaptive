import styled from "@emotion/styled";
import { useState, useRef, useCallback, useMemo } from "react";
import { color } from "../../../tokens";
import { AxisRange } from "../../../types";

const StyledWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  flex: '0 0 180px',
  textAlign: 'left'
})

export const AxisRangeSetting = ({onApplyRange: _onApplyRange}: {onApplyRange: (range: AxisRange) => void}) => {
  const [range, setRange] = useState<AxisRange>({min: undefined, max: undefined})
  const minRef = useRef<HTMLInputElement | null>(null);
  const maxRef = useRef<HTMLInputElement | null>(null);

  const onApplyRange = useCallback(() => {
    _onApplyRange(range)
  }, [_onApplyRange, range])

  const reset = useCallback(() => {
    const newXRange = {min: undefined, max: undefined}
    setRange(newXRange)
    _onApplyRange(newXRange)
    if (!!minRef.current) {
      minRef.current.value= ''
    }
    if (!!maxRef.current) {
      maxRef.current.value= ''
    }
  }, [_onApplyRange])

  const isApplyDisabled = useMemo(() => {
    const {min, max} = range 
    if (min === undefined || max === undefined) {
      return true
    }
    return max <= min
  }, [range])

  return (
    <StyledWrapper>
      <label htmlFor="min">Min Value:</label>
      <input id="min" type="number" onChange={e => setRange({min: parseInt(e.currentTarget.value), max: range.max})} ref={minRef}></input>
      <label htmlFor="max">Max Value:</label>
      <input id="max" type="number" onChange={e => setRange({min: range.min, max: parseInt(e.currentTarget.value)})} ref={maxRef}></input>
      <button onClick={onApplyRange} disabled={isApplyDisabled}>Apply</button>
      <button onClick={reset}>Reset</button>
    </StyledWrapper>
  )
}