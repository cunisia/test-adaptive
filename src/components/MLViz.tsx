import styled from "@emotion/styled";
import { Action, Store } from "../store/reducer";
import { RunPicker } from "./RunPicker";
import { TokenLossChart } from "./TokenLossChart/TokenLossChart";

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  height: '100%'
})

const StyledTokenLossChartWrapper = styled.div({
  padding: '16px',
  flex: '1 1 0',
})

export const MLViz = ({store, dispatch}: {store: Store, dispatch: React.Dispatch<Action>}) => {
  return (  
    <Wrapper>
      <RunPicker store={store} dispatch={dispatch} />
      <StyledTokenLossChartWrapper>
        <TokenLossChart store={store} />
      </StyledTokenLossChartWrapper>
    </Wrapper>
  );
}