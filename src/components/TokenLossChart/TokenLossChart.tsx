import { useCallback, useEffect,useState } from "react";
import { initSciChart } from "./scichart";
import { Store } from "../../store/reducer";
import { EDataSeriesType, EZoomState, NumberRange, SciChartSurface, TSciChart, XyDataSeries } from "scichart";
import { usePrevious } from "../../hooks/usePrevious";
import _ from "lodash";
import styled from "@emotion/styled";
import { AxisRange } from "../../types";
import { TokenLossChartSettings } from "./Settings/TokenLossChartSettings";

const StyledWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
})

const FlexWrapper = styled.div({
  flex: '1 1 auto',
})

const isAxisRangeEffective = (r: AxisRange | undefined) => r?.max !== undefined && r?.min !== undefined

export const TokenLossChart = ({store} : {store: Store}) => {
  const [sciChart, setSciChart] = useState<SciChartSurface>()
  const [wasmContext, setWasmContext] = useState<TSciChart>()
  const prevSubscriptions = usePrevious(store.subscriptions)
  const [xRange, setXRange] = useState<AxisRange | undefined>()
  const [yRange, setYRange] = useState<AxisRange | undefined>()

  const hasXRange = useCallback(() => {
    return isAxisRangeEffective(xRange)
  }, [xRange])

  const hasYRange = useCallback(() => {
    return isAxisRangeEffective(yRange)
  }, [yRange])

  // Init scichart on component mount
  useEffect(() => {
    const chartInitializationPromise = initSciChart({runNames: store.runNames, runColor: store.runColor});
    chartInitializationPromise.then(({sciChartSurface, wasmContext}) => {
      setSciChart(sciChartSurface)
      setWasmContext(wasmContext)
    })
    
    // Ensure that sciChartSurface is deleted on component unmount.
    return () => {
      chartInitializationPromise.then(({sciChartSurface}) => sciChartSurface.delete());
    };
  }, [store.runColor, store.runNames]);

  // Update scichart
  useEffect(() => {
    if (!sciChart || !wasmContext) {
      return
    }
    const prevRunsList = Object.keys(prevSubscriptions ?? {})
    const newRunsList = Object.keys(store.subscriptions)
    
    // Add / Remove runs
    const runsToRemove = _.difference(prevRunsList, newRunsList)
    const runsToAdd = _.difference(newRunsList, prevRunsList)
    sciChart.renderableSeries.asArray().forEach(renderableSerie => {
      if (runsToRemove.includes(renderableSerie.id)) {
        renderableSerie.isVisible = false
      }
      if (runsToAdd.includes(renderableSerie.id)) {
        renderableSerie.isVisible = true
      }
    })

    // Push new data
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
        if (sciChart.zoomState !== EZoomState.UserZooming && !hasXRange() && !hasYRange()) {
          sciChart.zoomExtents();
        }
      }
    })
  }, [hasXRange, hasYRange, prevSubscriptions, sciChart, store.runData, store.subscriptions, wasmContext, xRange])

  useEffect(() => {
    if (!sciChart || !xRange) {
      return
    }
    sciChart.xAxes.get(0).visibleRange = new NumberRange(xRange.min, xRange.max)
  }, [sciChart, xRange])

  useEffect(() => {
    if (!sciChart || !yRange) {
      return
    }
    sciChart.yAxes.get(0).visibleRange = new NumberRange(yRange.min, yRange.max)
  }, [sciChart, yRange])

  const onApplyXRange = useCallback((xRange: AxisRange) => {
    if (!sciChart) {
      return
    }
    if (xRange.min === undefined && xRange.max === undefined) {
      sciChart.zoomExtents();
      if (!!yRange && hasYRange()) {
        sciChart.yAxes.get(0).visibleRange = new NumberRange(yRange.min, yRange.max)
      }
    }
    setXRange(xRange)
  }, [hasYRange, sciChart, yRange])

  const onApplyYRange = useCallback((yRange: AxisRange) => {
    if (!sciChart) {
      return
    }
    if (yRange.min === undefined && yRange.max === undefined) {
      sciChart.zoomExtents();
      if (!!xRange && hasXRange()) {
        sciChart.xAxes.get(0).visibleRange = new NumberRange(xRange.min, xRange.max)
      }
    }
    setYRange(yRange)
  }, [hasXRange, sciChart, xRange])

  return (
    <StyledWrapper>
      <FlexWrapper><div id="scichart-root" /></FlexWrapper>
      <TokenLossChartSettings onApplyXRange={onApplyXRange} onApplyYRange={onApplyYRange} />
    </StyledWrapper>
  );
}