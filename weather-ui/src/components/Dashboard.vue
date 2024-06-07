<script setup>
import { ref } from "vue";

import { Bar, Line, Pie } from "vue-chartjs";

import { getRequest } from "../common/api.service";

import Chart from "chart.js/auto";

const DEFAULT_CHART_OPTIONS = {
  responsive: true,
};

const loading = ref(false);
const dataLoaded = ref(false);
const searching = ref(false);
const searchText = ref("");
const queryText = ref("");

const temperatureData = ref({
  data: {
    datasets: [],
  },
  options: {
    ...DEFAULT_CHART_OPTIONS,
    plugins: { title: { display: true, text: "7 day temperature forcast" } },
  },
});
const rainData = ref({
  data: {
    datasets: [],
  },
  options: {
    ...DEFAULT_CHART_OPTIONS,
    plugins: { title: { display: true, text: "7 day rain forcast" } },
  },
});
const monthlyData = ref({
  data: {
    datasets: [],
  },
  options: {
    ...DEFAULT_CHART_OPTIONS,
    parsing: { xAxisKey: "x", yAxisKey: "y" },
    plugins: { title: { display: true, text: "5 year temperature historical chart" } },
  },
});
const locationList = ref([]);

const processLocationList = (results) => {
  locationList.value = [];
  results?.forEach(({ name, country, latitude, longitude }) => {
    locationList.value.push({
      title: `${name}, ${country}`,
      value: { latitude, longitude },
    });
  });
};

const processChartData = ({ lineChartData, barChartData, pieChartData }) => {
  const pieLabel = [];
  const pieValues = [];

  temperatureData.value.data = {
    datasets: [
      { label: "Temperature", tension: 0.1, data: lineChartData?.results },
    ],
  };

  rainData.value.data = {
    datasets: [{ label: "Rain", tension: 0.1, data: barChartData?.results }],
  };

  pieChartData.results.forEach((element) => {
    pieLabel.push(element.x);
    pieValues.push(element.y);
  });

  monthlyData.value.data = {
    labels: pieLabel,
    datasets: [
      {
        label: "Temperature",
        data: pieValues,
      },
    ],
  };
};

const getDailyForcast = async (payload) => {
  const searchParams = new URLSearchParams(payload);
  const url = new URL(`http://localhost:3000/weather/daily-forecast`);
  url.search = searchParams.toString();
  const { data } = await getRequest(url);
  return data;
};

const getHistoricalData = async (payload) => {
  const searchParams = new URLSearchParams(payload);
  const url = new URL(`http://localhost:3000/weather/historical-data`);
  url.search = searchParams.toString();
  const { data } = await getRequest(url);
  return data;
};

const setCharts = async () => {
  try {
    if (!searchText.value || searchText.value === "") return;

    const payload = {
      ...searchText.value,
    };

    loading.value = true;
    dataLoaded.value = false;
    const [lineChartData, barChartData, pieChartData] = await Promise.all([
      getDailyForcast({ ...payload, hourly: "temperature_2m" }),
      getDailyForcast({ ...payload, hourly: "rain" }),
      getHistoricalData({
        ...payload,
        start_date: "2015-01-01",
        end_date: "2019-12-31",
        hourly: "temperature_2m",
      }),
    ]);

    processChartData({ lineChartData, barChartData, pieChartData });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    dataLoaded.value = true;
  }
};

const getLocationList = async () => {
  try {
    console.log("Fetch location list for ", queryText.value);
    searching.value = true;
    if (!queryText.value || queryText.value === "") return;
    const URL = `http://localhost:3000/weather/search?searchText=${queryText.value}`;
    const {
      data: { results },
    } = await getRequest(URL);

    processLocationList(results);
  } catch (error) {
    console.error(error);
  } finally {
    searching.value = false;
  }
};
</script>

<template>
  <v-container>
    <v-row class="search-bar">
      <v-col>
        <v-autocomplete
          clearable
          variant="solo-filled"
          hide-no-data
          label="Search city"
          :hint="'Hit enter to search!'"
          :items="locationList"
          v-model="searchText"
          :loading="searching"
          :color="'primary'"
          @update:search="queryText = $event"
          @keydown.enter="getLocationList"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              v-bind="props"
              :title="item.title"
              @click="setCharts"
            ></v-list-item>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-col class="d-flex justify-center">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-col>
    </v-row>
    <v-row v-if="!loading && dataLoaded">
      <v-col>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Line v-if="!loading" :data="temperatureData.data" :options="temperatureData.options" />
            </div>
          </v-col>
        </v-row>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Bar v-if="!loading" :data="rainData.data" :options="rainData.options" />
            </div>
          </v-col>
        </v-row>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Pie v-if="!loading" :data="monthlyData.data" :options="monthlyData.options" />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
