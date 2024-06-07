<script setup>
import { onBeforeMount, ref } from "vue";

import { Bar, Line, Pie } from "vue-chartjs";

import { getRequest } from "../common/api.service";

import Chart from "chart.js/auto";

const loading = ref(false);
const searching = ref(false);
const searchText = ref("");
const queryText = ref("");

const temperatureData = ref({
  labels: [],
  datasets: [],
});
const rainData = ref({
  labels: [],
  datasets: [],
});
const monthlyData = ref({
  labels: [],
  datasets: [],
});
const locationList = ref([]);

const chartOptions = ref({
  responsive: true,
});

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

  temperatureData.value = {
    datasets: [
      { label: "Temperature", tension: 0.1, data: lineChartData?.results },
    ],
  };

  rainData.value = {
    datasets: [{ label: "Rain", tension: 0.1, data: barChartData?.results }],
  };

  pieChartData.results.forEach((element) => {
    pieLabel.push(element.x);
    pieValues.push(element.y);
  });

  monthlyData.value = {
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

onBeforeMount(async () => {});
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
    <v-row v-if="!loading">
      <v-col>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Line
                v-if="!loading"
                :data="temperatureData"
                :options="chartOptions"
              />
            </div>
          </v-col>
        </v-row>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Bar v-if="!loading" :data="rainData" :options="chartOptions" />
            </div>
          </v-col>
        </v-row>
        <v-row class="charts-box">
          <v-col>
            <div>
              <Pie
                v-if="!loading"
                :data="monthlyData"
                :options="{ parsing: { xAxisKey: 'x', yAxisKey: 'y' } }"
              />
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
