import styled from "@emotion/styled";
import { Action, Store } from "../store/reducer";
import { RunPicker } from "./RunPicker";
import { StyledTokenLossChartWrapper } from "./TokenLossChart/TokenLossChartPlaceholder";

const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  height: '100%'
})

export const MLViz = ({store, dispatch}: {store: Store, dispatch: React.Dispatch<Action>}) => {
  return (  
    <Wrapper>
      <RunPicker store={store} dispatch={dispatch} />
      <StyledTokenLossChartWrapper store={store} />
    </Wrapper>
  );
}