import styled from "@emotion/styled";
import { useMemo } from "react";
import { Store } from "../../store/reducer"
import { color } from "../../tokens";
import { TokenLossChart } from "./TokenLossChart";

const StyledPlaceholder = styled.span({
  margin: 'auto',
  color: color['text-light'],
})

const StyledWrapper = styled.div({
  flex: '1 1 0',
})

export const StyledTokenLossChartWrapper = ({store} : {store: Store}) => {
  const runsToDisplay = useMemo(() => Object.keys(store.subscriptions), [store.subscriptions]);

  if (runsToDisplay.length === 0) {
    return <StyledPlaceholder>Pick some run to display</StyledPlaceholder>
  }

  return (
    <StyledWrapper>
      <TokenLossChart store={store}/>
    </StyledWrapper>
  )
}