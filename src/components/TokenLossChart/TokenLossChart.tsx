import { useEffect,useMemo,useState } from "react";
import { initSciChart } from "./scichart";
import { Store } from "../../store/reducer";
import { EDataSeriesType, EZoomState, SciChartSurface, XyDataSeries } from "scichart";
import styled from "@emotion/styled";
import { color } from "../../tokens";

const StyledPlaceholder = styled.span({
  position: 'relative',
  top: '50%',
  transform: 'translate(0, -50%)',
  margin: 'auto',
  color: color['text-light'],
})

export const TokenLossChart = ({store} : {store: Store}) => {
  const [sciChart, setSciChart] = useState<SciChartSurface>()
  const runsToDisplay = useMemo(() => Object.keys(store.subscriptions), [store.subscriptions]);


  useEffect(() => {
    if (runsToDisplay.length === 0) {
      return
    }
    // Best practise in React is to ensure that sciChartSurface is deleted on component unmount.
    // Here's one way to do this
    const chartInitializationPromise = initSciChart({runNames: store.runNames, runColor: store.runColor});
    chartInitializationPromise.then(sciChartSurface => {
      setSciChart(sciChartSurface)
    })

    return () => {
      chartInitializationPromise.then((sciChartSurface) => sciChartSurface.delete());
    };
  }, [runsToDisplay.length, store.runColor, store.runNames]);

  useEffect(() => {
    if (!sciChart) {
      return
    }
    sciChart.renderableSeries.asArray().forEach(renderableSerie => {
      const { dataSeries: _dataSeries } = renderableSerie
      if (renderableSerie.dataSeries.type !== EDataSeriesType.Xy) {
        return 
      }
      const dataSeries: XyDataSeries = _dataSeries as XyDataSeries // casting is ok since we've juste checked the type
      const renderedDataPointsLength = dataSeries.count()
      const existingDataPoints = store.runData[renderableSerie.id]
      const existingDataPointsLength = existingDataPoints?.tokens?.length || 0
      if (existingDataPointsLength > renderedDataPointsLength) {
        const newDataXPoints = existingDataPoints.tokens.slice(renderedDataPointsLength);
        const newDataYPoints = existingDataPoints.losses.slice(renderedDataPointsLength);
        dataSeries.appendRange(newDataXPoints, newDataYPoints)
        if (sciChart.zoomState !== EZoomState.UserZooming) {
          sciChart.zoomExtents();
        }
      }
    })
  }, [store.runData, sciChart])

  if (runsToDisplay.length === 0) {
    return <StyledPlaceholder>Pick some run to display</StyledPlaceholder>
  }

  return (
    <>
      <div id="scichart-root" style={{ maxWidth: 900 }} />
    </>
  );
}