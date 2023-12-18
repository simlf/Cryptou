<template>
  <div class="crypto-graph-wrapper">
    <div id="chartdiv"/>
    <div id="tools">
      Select data granularity
      <input type="button" value="1 minute" id="btn_m">
      <input type="button" value="1 hour" id="btn_h">
      <input type="button" value="1 day" id="btn_d" class="active">
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { CryptoChartData } from "@/types/cryptoInterface.ts";

const props = defineProps({
  cryptoId: {
    type: Number,
    required: true
  }
})

let loading = ref(true);

let chart: am5xy.XYChart;

let root: am5.Root;

async function fetchData() {

  root = am5.Root.new("chartdiv");

  chart = root.container.children.push(am5xy.XYChart.new(root, {
    panX: true,
    panY: false,
    wheelX: "panX",
    wheelY: "zoomX",
    layout: root.verticalLayout,
    pinchZoomX: true,
    paddingLeft: 0
  }));

  chart.get("colors").set("step", 2);

// Create axes
  let valueAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
      pan: "zoom"
    }),
    height: am5.percent(70)
  }));

  valueAxis.get("renderer").labels.template.setAll({
    centerY: am5.percent(100),
    maxPosition: 0.98
  });

  valueAxis.axisHeader.children.push(am5.Label.new(root, {
    text: "Value",
    fontWeight: "bold",
    paddingBottom: 5,
    paddingTop: 5
  }));

  let volumeAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
      pan: "zoom"
    }),
    height: am5.percent(30),
    layer: 5,
    numberFormat: "#a"
  }));

  volumeAxis.get("renderer").labels.template.setAll({
    centerY: am5.percent(100),
    maxPosition: 0.98
  });

  volumeAxis.axisHeader.set("paddingTop", 10);
  volumeAxis.axisHeader.children.push(am5.Label.new(root, {
    text: "Volume",
    fontWeight: "bold",
    paddingTop: 5,
    paddingBottom: 5
  }));

  let dateAxis = chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    maxDeviation: 1,
    baseInterval: { timeUnit: "day", count: 1 },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true,
      pan: "zoom"
    }),
    tooltip: am5.Tooltip.new(root, {})
  }));

  dateAxis.get("renderer").labels.template.setAll({
    minPosition: 0.01,
    maxPosition: 0.99
  });

  let color = root.interfaceColors.get("background");

// Create series
  let valueSeries = chart.series.push(
      am5xy.CandlestickSeries.new(root, {
        fill: color,
        clustered: false,
        calculateAggregates: true,
        stroke: color,
        name: "STCK",
        xAxis: dateAxis,
        yAxis: valueAxis,
        valueYField: "close",
        openValueYField: "open",
        lowValueYField: "low",
        highValueYField: "high",
        valueXField: "date",
        lowValueYGrouped: "low",
        highValueYGrouped: "high",
        openValueYGrouped: "open",
        valueYGrouped: "close",
        legendValueText: "open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}",
        legendRangeValueText: "open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}"
      })
  );

  let valueTooltip = valueSeries.set("tooltip", am5.Tooltip.new(root, {
    getFillFromSprite: false,
    getStrokeFromSprite: true,
    getLabelFillFromSprite: true,
    autoTextColor: false,
    pointerOrientation: "horizontal",
    labelText: "{name}: open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}"
  }));
  valueTooltip.get("background").set("fill", root.interfaceColors.get("background"));

  let firstColor = chart.get("colors").getIndex(0);
  let volumeSeries = chart.series.push(am5xy.ColumnSeries.new(root, {
    name: "STCK",
    clustered: false,
    fill: firstColor,
    stroke: firstColor,
    valueYField: "volume",
    valueXField: "date",
    valueYGrouped: "sum",
    xAxis: dateAxis,
    yAxis: volumeAxis,
    legendValueText: "{valueY}",
    tooltip: am5.Tooltip.new(root, {
      labelText: "{valueY}"
    })
  }));

  let valueLegend = valueAxis.axisHeader.children.push(
      am5.Legend.new(root, {
        useDefaultMarker: true
      })
  );
  valueLegend.data.setAll([valueSeries]);

  let volumeLegend = volumeAxis.axisHeader.children.push(
      am5.Legend.new(root, {
        useDefaultMarker: true
      })
  );
  volumeLegend.data.setAll([volumeSeries]);

  chart.leftAxesContainer.set("layout", root.verticalLayout);

  // Add cursor
  chart.set("cursor", am5xy.XYCursor.new(root, {}))

  valueSeries.columns.template.states.create("riseFromOpen", {
    fill: am5.color(0x76b041),
    stroke: am5.color(0x76b041)
  });
  valueSeries.columns.template.states.create("dropFromOpen", {
    fill: am5.color(0xe4572e),
    stroke: am5.color(0xe4572e)
  });

  let scrollbar = chart.set("scrollbarX", am5xy.XYChartScrollbar.new(root, {
    orientation: "horizontal",
    height: 50
  }));

  let sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
      timeUnit: "day",
      count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {
      minorGridEnabled: true
    })
  }));

  let sbValueAxis = scrollbar.chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
  );

  let sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
    valueYField: "close",
    valueXField: "date",
    xAxis: sbDateAxis,
    yAxis: sbValueAxis
  }));

  sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3
  });

  // Set up data loader
  function loadData(unit: string, min: number, max: number, side: string) {

    let url = `http://localhost:3000/cryptos/graph/${props.cryptoId}/${unit}/${min / 1000}/${max / 1000}`;
    // Handle loaded data
    am5.net.load(url).then(function (result) {

    let data: CryptoChartData[] = [];
    // Parse loaded data
    data = am5.JSONParser.parse(result.response);

    data = data.map((item: CryptoChartData) => {
      return {
        date: new Date(item.time * 1000).getTime(), // convert Unix timestamp to JavaScript Date
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volumefrom
      }
    });

    // Process data (convert dates and values)
    let processor = am5.DataProcessor.new(root, {
      numericFields: ["date", "open", "high", "low", "close", "volume"]
    });
    processor.processMany(data);

    let start: number = dateAxis.get("start");
    let end: number = dateAxis.get("end");

    // will hold first/last dates of each series
    let seriesFirst = {};
    let seriesLast = {};

    // Set data
    if (side == "none") {
      if (data.length > 0) {
        // change base interval if it's different
        if (dateAxis.get("baseInterval").timeUnit != unit) {
          dateAxis.set("baseInterval", { timeUnit: unit, count: 1 });
          sbDateAxis.set("baseInterval", { timeUnit: unit, count: 1 });
        }

        dateAxis.set("min", min);
        dateAxis.set("max", max);
        dateAxis.setPrivate("min", min);   // needed in order not to animate
        dateAxis.setPrivate("max", max);   // needed in order not to animate

        valueSeries.data.setAll(data);
        volumeSeries.data.setAll(data);
        sbSeries.data.setAll(data);

        dateAxis.zoom(0, 1, 0);
      }
    }
    else if (side == "left") {
      // save dates of first items so that duplicates would not be added
      seriesFirst[valueSeries.uid] = valueSeries.data.getIndex(0).date;
      seriesFirst[volumeSeries.uid] = volumeSeries.data.getIndex(0).date;
      seriesFirst[sbSeries.uid] = sbSeries.data.getIndex(0).date;

      for (let i = data.length - 1; i >= 0; i--) {
        let date: number = parseInt(data[i].date);
        // only add if first items date is bigger then newly added items date
        if (seriesFirst[valueSeries.uid] > date) {
          valueSeries.data.unshift(data[i]);
        }
        if (seriesFirst[volumeSeries.uid] > date) {
          volumeSeries.data.unshift(data[i]);
        }
        if (seriesFirst[sbSeries.uid] > date) {
          sbSeries.data.unshift(data[i]);
        }
      }

      // update axis min
      min = Math.max(min, parseInt(absoluteMin.getTime().toString()));
      dateAxis.set("min", min);
      dateAxis.setPrivate("min", min); // needed in order not to animate
      // recalculate start and end so that the selection would remain
      dateAxis.set("start", 0);
      dateAxis.set("end", (end - start) / (1 - start));
    }
    else if (side == "right") {
      // save dates of last items so that duplicates would not be added
      seriesLast[valueSeries.uid] = valueSeries.data.getIndex(valueSeries.data.length - 1).date;
      seriesLast[volumeSeries.uid] = volumeSeries.data.getIndex(volumeSeries.data.length - 1).date;
      seriesLast[sbSeries.uid] = sbSeries.data.getIndex(sbSeries.data.length - 1).date;

      for (let i = 0; i < data.length; i++) {
        let date = data[i].date;
        // only add if last items date is smaller then newly added items date
        if (seriesLast[valueSeries.uid] < date) {
          valueSeries.data.push(data[i]);
        }
        if (seriesLast[volumeSeries.uid] < date) {
          volumeSeries.data.push(data[i]);
        }
        if (seriesLast[sbSeries.uid] < date) {
          sbSeries.data.push(data[i]);
        }
      }
      // update axis max
      max = Math.min(max, absoluteMax);
      dateAxis.set("max", max);
      dateAxis.setPrivate("max", max); // needed in order not to animate

      // recalculate start and end so that the selection would remain
      dateAxis.set("start", start / end);
      dateAxis.set("end", 1);
    }
  });
  }

  function loadSomeData() {
    let start: number = dateAxis.get("start");
    let end: number = dateAxis.get("end");

    let selectionMin = parseInt(Math.max(dateAxis.getPrivate("selectionMin"), absoluteMin).toFixed(0));
    let selectionMax = parseInt(Math.min(dateAxis.getPrivate("selectionMax"), absoluteMax).toFixed(0));

    let min: number = dateAxis.getPrivate("min");
    let max: number = dateAxis.getPrivate("max");


    // if start is less than 0, means we are panning to the right, need to load data to the left (earlier days)
    if (start < 0) {
      loadData(currentUnit, selectionMin, max, "left");
    }
    // if end is bigger than 1, means we are panning to the left, need to load data to the right (later days)
    if (end > 1) {
      loadData(currentUnit, min, selectionMax, "right");
    }
  }

  //Init eventListeners for buttons
  let activeButton = document.getElementById("btn_d");
  document.getElementById("btn_h").addEventListener("click", function () {
    if (currentUnit != "hour") {
      setActiveButton(this);
      currentUnit = "hour";
      loadData("hour", dateAxis.getPrivate("selectionMin"), dateAxis.getPrivate("selectionMax"), "none");
    }
  })

  document.getElementById("btn_d").addEventListener("click", function () {
    if (currentUnit != "day") {
      setActiveButton(this);
      currentUnit = "day";
      loadData("day", dateAxis.getPrivate("selectionMin"), dateAxis.getPrivate("selectionMax"), "none");
    }
  })

  document.getElementById("btn_m").addEventListener("click", function () {
    if (currentUnit != "minute") {
      setActiveButton(this);
      currentUnit = "minute";
      loadData("minute", dateAxis.getPrivate("selectionMin"), dateAxis.getPrivate("selectionMax"), "none");
    }
  })

  function setActiveButton(button: HTMLElement) {
    if (activeButton) {
      activeButton.className = "";
    }
    activeButton = button;
    button.className = "active";
  }

  let currentDate = new Date();
  let currentUnit = "day";

// initially load 30 days
  let max = currentDate.getTime();
  currentDate.setDate(new Date().getDate() - 30);
  let min = currentDate.getTime();
// limit to the data's extremes
  let absoluteMax = new Date();
  let absoluteMin = new Date(2000, 0, 1, 0, 0, 0, 0);

// load data when panning ends
  chart.events.on("panended", function () {
    loadSomeData();
  });

// load data when zooming ends
  let wheelTimeout;

  chart.events.on("wheelended", function () {
    if (wheelTimeout) {
      wheelTimeout.dispose();
    }

    wheelTimeout = chart.setTimeout(function () {
      loadSomeData();
    }, 50);
  });

  loadData("day", min, max, "none");
  await chart.appear(1000, 500);
  loading.value = false;
}

onMounted(() => {
  fetchData()
});

onUnmounted(() => {
  root.dispose();
  chart.dispose();
});

</script>

<style scoped>
.crypto-graph-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  height: 80vh;
}

#chartdiv {
  width: 100%;
  height: 100%;
}

#tools input {
  padding: 8px 16px;
  margin: 0 5px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #fff;
}

#tools input.active {
  background-color: var(--primary-light-green);
  color: #000000;
  border-color: #4CAF50;
}
</style>
