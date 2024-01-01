import axios from "axios"
import { useRef, useEffect, useCallback } from "react"
import { getRunUrl } from "../const"
import { RunData } from "../types"
import { Action, Store } from "../store/reducer"

export const useGetMoreData = (store: Store, dispatch: React.Dispatch<Action>) => {
  // We need to put those in ref in order to always access fresh data from timeout callback
  const nbTokensByRun = useRef<{ [key: string]: number }>({});
  const subscriptionsRef = useRef<{[runName: string]: NodeJS.Timer;}>(store.subscriptions)

  // Update nbTokensByRun when runData changes
  useEffect(() => {
    nbTokensByRun.current = store.runNames.reduce((_nbTokensByRun, runName) => {
      const nbTokens = store.runData[runName]?.tokens.length || 0
      _nbTokensByRun[runName] = nbTokens;
      return _nbTokensByRun
    }, {} as { [key: string]: number })
  })

  useEffect(() => {
    subscriptionsRef.current = store.subscriptions
  })

  const getMoreData = useCallback(async ({runName, isInitialization} : {runName: string, isInitialization: boolean}) => {
    const  nbTokens = nbTokensByRun.current[runName];
    const iteration = nbTokens === 0 ? 0 : nbTokens + 1;
    try {
      const response = await axios.get(getRunUrl(runName, iteration));
      const data = response.data as RunData;
      dispatch({type: 'PUSH_DATA', payload: {runName, runData: data, iteration}});
    } catch (e) {
      console.log("Error getting more data for run, retrying...", runName, e);
    } finally {
      // We need to check if user did not unsubscribe while data was loading 
      if (isInitialization || !!subscriptionsRef.current[runName]) {
        const timeoutId = setTimeout(() => getMoreData({runName, isInitialization: false}), 1000);
        dispatch({type: 'SUBSCRIBE', payload: {runName, timeoutId}});
      }
    }
  }, [dispatch])

  const getNbToken = useCallback((runName: string) => {
    return nbTokensByRun.current[runName];
  }, [])

  return {getMoreData, getNbToken}
}