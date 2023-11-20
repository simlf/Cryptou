<template>
  <div id="app">
    <h1>Crypto Graph</h1>
    <div id="chartdiv" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const API_URL = "http://localhost:3000";

async function getCryptoHistory() {
  const response = await axios.get(`${API_URL}/crypto`);
  return response.data;
}

let chart = ref(null);

onMounted(async () => {
  let data = await getCryptoHistory();

  // Dispose of the chart if it exists
  if (chart.value) {
    chart.value.dispose();
  }

  chart.value = am4core.create("chartdiv", am4charts.XYChart);
  chart.value.paddingRight = 20;

  let dateAxis = chart.value.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 50;

  let valueAxis = chart.value.yAxes.push(new am4charts.ValueAxis());
  valueAxis.renderer.minGridDistance = 20;

  let series = chart.value.series.push(new am4charts.CandlestickSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "close";
  series.dataFields.openValueY = "open";
  series.dataFields.lowValueY = "low";
  series.dataFields.highValueY = "high";

  series.data = data.map(item => ({
    date: new Date(item.time * 1000),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close
  }));
});
</script>
