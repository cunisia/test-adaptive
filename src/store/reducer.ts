import { TColor, color } from "../tokens"
import { RunData } from "../types"

export type Store = {
  runNames: string[]
  runColor: {[runName: string]: TColor}
  runData: { [runName: string]: RunData }
  subscriptions: { [runName: string]: NodeJS.Timer }
}

export type Action = {
  type: 'SET_RUNS',
  payload: {runNames: string[]}
} | {
  type: 'PUSH_DATA',
  payload: {runName: string, runData: RunData, iteration: number}
} | {
  type: 'SUBSCRIBE',
  payload: {runName: string, timeoutId:  NodeJS.Timer}
} | {
  type: 'UNSUBSCRIBE',
  payload: {runName: string}
}

export const LINE_COLORS: TColor[] = [
  'line-yellow',
  'line-blue',
  'line-green',
  'line-salmon',
  'line-dark-blue',
  'line-dark-purple',
]

export const reducer =  (store: Store, {type, payload}: Action): Store => {
  switch (type) {
    case 'SET_RUNS':
      return {...store, runNames: payload.runNames, runColor: payload.runNames.reduce((_runColor, runName, i) => {
        return {..._runColor, [runName]: color[LINE_COLORS[i % LINE_COLORS.length]]}
      }, {})}
    case 'PUSH_DATA': { 
        const {runName, runData, iteration} = payload;
        if (iteration > 0 && iteration <= (store.runData[runName]?.tokens.length ?? 0)) {
          return store;
        }
        const isExistingData = !!store.runData[runName]
        const dataUpdate = isExistingData ? {
          tokens: store.runData[runName].tokens.concat(runData.tokens), 
          losses: store.runData[runName].losses.concat(runData.losses)
        } : runData;
        const newRunData = {...store.runData,  [runName]: dataUpdate};
        return {...store, runData: newRunData}
      }
    case 'SUBSCRIBE': {
      const {runName, timeoutId} = payload;
      const newSubscriptions = {...store.subscriptions, [runName]: timeoutId};
      return {...store, subscriptions: newSubscriptions}    
    }
    case 'UNSUBSCRIBE': {
      const {runName} = payload;
      const newSubscriptions = {...store.subscriptions};
      delete newSubscriptions[runName];
      return {...store, subscriptions: newSubscriptions}
    }
    default:
      return store;
    }
  }