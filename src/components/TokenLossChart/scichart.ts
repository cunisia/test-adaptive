import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  NumberRange,
  SciChartJSLightTheme,
  ENumericFormat,
  LegendModifier,
  ELegendPlacement,
  RolloverModifier,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  ZoomPanModifier,
  EXyDirection
} from "scichart";
import { Store } from "../../store/reducer";

export const initSciChart = async ({runNames, runColor}: Pick<Store, 'runNames' | 'runColor'>) => {
  // LICENSING
  // Commercial licenses set your license code here
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  // How-to steps at https://www.scichart.com/licensing-scichart-js/
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

  // Initialize SciChartSurface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-root", {
    theme: new SciChartJSLightTheme(),
    title: "Token Loss Chart",
    titleStyle: { fontSize: 16 }
  });

  // Create an XAxis and YAxis with growBy padding
  const growBy = new NumberRange(0.1, 0.1);
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "Tokens", axisTitleStyle: { fontSize: 16 }, growBy, labelFormat: ENumericFormat.Exponential }));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "Losses", axisTitleStyle: { fontSize: 16 }, growBy }));

  // Add chart modifers
  const legendModifier = new  LegendModifier({placement: ELegendPlacement.TopRight})
  const tooltipModifier = new RolloverModifier({snapToDataPoint: true, showAxisLabel: true, xyDirection: EXyDirection.XyDirection});
  const mouseWheelZoomModifier = new MouseWheelZoomModifier();
  const zoomPanModifier = new ZoomPanModifier();   
  const zoomExtentsModifier = new ZoomExtentsModifier();   
  sciChartSurface.chartModifiers.add(legendModifier);
  sciChartSurface.chartModifiers.add(tooltipModifier);
  sciChartSurface.chartModifiers.add(zoomExtentsModifier);
  sciChartSurface.chartModifiers.add(zoomPanModifier);
  sciChartSurface.chartModifiers.add(mouseWheelZoomModifier);

  // Create a line series for each run
  runNames.forEach(runName => {
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
      id: runName,
      stroke: runColor[runName],
      strokeThickness: 1,
      dataSeries: new XyDataSeries(wasmContext, {
        dataSeriesName: runName,
        xValues: [],
        yValues: []
      }),
      pointMarker: new EllipsePointMarker(wasmContext, { width: 5, height: 5, fill: "#fff", stroke: runColor[runName], strokeThickness: 1}),
      animation: new SweepAnimation({ duration: 300, fadeEffect: true })
    }));
  })

  return {sciChartSurface, wasmContext};
}