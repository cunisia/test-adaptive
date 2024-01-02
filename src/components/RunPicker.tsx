import styled from "@emotion/styled"
import { useCallback, useEffect, useState } from "react"
import { useGetMoreData } from "../hooks/useGetMoreData"
import { Action, Store } from "../store/reducer"
import { Spinner } from "./Spinner"
import axios from "axios"
import { getListRunUrl } from "../const"
import { color } from "../tokens"

const StyledLabel = styled.span({
  textAlign: 'left',
  color: color["text-dark"],
  fontSize: '16px'
})

const StyledUl = styled.ul({
  listStyleType: 'none',
  textAlign: 'left',
  padding: 0,
  margin: 0,
})

const StyledLi = styled.li({
  cursor: 'pointer',
  marginBottom: '4px',
  '&:hover': {
    color: color["text-dark"],
  },
  display: 'flex', 
  flexDirection: 'row',
  gap: '4px',
  alignItems: 'center'
})

const Filler = styled.span({
  flex: '1 1 0'
})

const StyledRunPickerWrapper = styled.div({
  flex: '0 0 180px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '16px',
  borderRight: `1px ${color.border} solid`
})

const StyledNbDataPoints = styled.span({
  color: color["text-light"],
  fontSize: '12px'
})

export const RunPicker = ({store, dispatch}: {store: Store, dispatch: React.Dispatch<Action>}) => {
  const {getMoreData, getNbToken} = useGetMoreData(store, dispatch);
  const [loading, setLoading] = useState<{[runName: string]: boolean}>({})
  const [loadingRunList, setLoadingRunList] = useState<boolean>(false)

    // Load runs list on mount
    useEffect(() => {
      setLoadingRunList(true)
      axios.get(getListRunUrl())
        .then((response) => {
          dispatch({type: 'SET_RUNS', payload: {runNames: response.data}});
        })
        .catch((error) => {
          console.log("Some error occurred retrieving runs list", error);
        })
        .finally(() => {
          setLoadingRunList(false)
        })
    }, [dispatch])

  const onClickOnRun = useCallback(async (runName: string) => {
    if  (!store.subscriptions[runName]) {
      setLoading({...loading, [runName]: true})
      getMoreData({runName, isInitialization: true}).finally(() => {
        setLoading({...loading, [runName]: false})
      });
    } else {
      clearTimeout(store.subscriptions[runName]);
      dispatch({type: 'UNSUBSCRIBE', payload: {runName}});
    }
  }, [dispatch, getMoreData, loading, store.subscriptions])

  const getIcon = (runName: string) => {
    //return <Spinner />
    if (loading[runName]) {
      return <Spinner />
    }
    return <span>{!!store.subscriptions[runName] ? "☑" : "□" }</span>
  }

  return (
    <StyledRunPickerWrapper>
      <StyledLabel>Runs</StyledLabel>
      {
        loadingRunList ? <Spinner /> : <StyledUl>
        {store.runNames.sort().map(runName =>  (
          <StyledLi key={runName} onClick={() => onClickOnRun(runName)}>
            {getIcon(runName)} 
            <span>{runName}</span> 
            <Filler />
            <StyledNbDataPoints>{getNbToken(runName)}</StyledNbDataPoints>
          </StyledLi>
        ))}
      </StyledUl>
      }
    </StyledRunPickerWrapper>
  )
}