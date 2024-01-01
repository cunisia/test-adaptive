import React, { useReducer } from 'react';
import './App.css';
import styled from '@emotion/styled';
import { MLViz } from './components/MLViz';
import { Header } from './components/Header';
import { reducer } from './store/reducer';

const StyledApp = styled.div({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

function App() {

  // Init store
  const [store, dispatch] = useReducer(reducer, { runNames: [], runColor: {}, runData: {}, subscriptions: {} });

  return (
    <StyledApp className="App">
      <Header />
      <MLViz store={store} dispatch={dispatch} />
    </StyledApp>
  );
}

export default App;
