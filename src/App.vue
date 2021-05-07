<template>
  <div class="p-grid p-d-flex" style="height:100%">
    <div class="p-col-3" id="left-nav">
      <StatePanel />
    </div>
    <div class="p-col-9"  id="main-content">
      <TabView>
        <TabPanel>
          <template #header>
            <i class="pi pi-chart-line icon"></i>
          </template>
          <Chart ref="chart" :width="450" :height="275" class="p-mt-3 p-mb-2" type="line" :data="temperature" :options="graphOpts" />
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="pi pi-sliders-v icon"></i>
          </template>
          <SetpointPanel :brewSetpoint="myBSP" @update:brewSetpoint="updateBSP($event)" />
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="pi pi-cog icon"></i>
          </template>
          <SettingsPanel />
        </TabPanel>
        <TabPanel :disabled="true">
          <template #header>
            <i class="pi pi-chart-line icon-before"></i>
            <span class="info">{{temp.toFixed(1)}}°C</span>
          </template>
        </TabPanel>
        <TabPanel :disabled="true">
          <template #header>
            <i class="pi pi-sliders-v icon-before" v-if="mode !== 'off'"></i>
            <span class="info" v-if="mode !== 'off'">{{`${sp.toFixed(1)}°C`}}</span>
          </template>
        </TabPanel>
        <TabPanel :disabled="true">
          <template #header>
            <i class="pi pi-clock icon-before" v-if="mode === 'brew'"></i>
            <span class="info" v-if="mode === 'brew'">{{`${brewTime.toFixed(0)}s`}}</span>
          </template>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<style scoped>
.info {
  font-size: 1.5rem
}
.icon {
  font-size: 2rem;
}
.icon-before {
  font-size: 1rem;
  margin-right: 0.5rem
}

canvas {
  height: 400px
}
</style>

<script>
import { ref } from 'vue'

import axios from 'axios'

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Chart from 'primevue/chart'

import StatePanel from './components/StatePanel'
import SetpointPanel from './components/SetpointPanel'
import SettingsPanel from './components/SettingsPanel'

export default {
  name: 'App',
  components: {
    TabView,
    TabPanel,
    Chart,
    StatePanel,
    SetpointPanel,
    SettingsPanel,
  },
  setup() {
    const myBSP = ref(100)

    function updateBSP(val) {
      console.log(val)
      myBSP.value = val + 2
      console.log(myBSP.value)
    }

    return {
      myBSP,
      updateBSP,
    }
  },
  methods: {
    thisTest(val) {
      console.log('chart?')
      console.log(val)
      this.myBSP = val+2
      console.log(this.myBSP)
    },
    handlePower() {
      if (this.mode == 'off') {
        axios.post('http://silvia:8081/mode/heat').then( () => {
          this.restUpdateStatus()
        })
      } else {
        axios.post('http://silvia:8081/mode/off').then( () => {
          this.restUpdateStatus()
        })
      }
    },
    handleBrew() {
      if (this.mode == 'brew') {
        axios.post('http://silvia:8081/mode/heat').then( () => {
          this.restUpdateStatus()
        })
      } else {
        axios.post('http://silvia:8081/mode/brew').then( () => {
          this.restUpdateStatus()
        })
      }
    },
    handleWater() {
      if (this.mode == 'water') {
        axios.post('http://silvia:8081/mode/heat').then( () => {
          this.restUpdateStatus()
        })
      } else {
        axios.post('http://silvia:8081/mode/water').then( () => {
          this.restUpdateStatus()
        })
      }
    },
    handleSteam() {
      if (this.mode == 'steam') {
        axios.post('http://silvia:8081/mode/heat').then( () => {
          this.restUpdateStatus()
        })
      } else {
        axios.post('http://silvia:8081/mode/steam').then( () => {
          this.restUpdateStatus()
        })
      }
    },
    restUpdateStatus() {
      axios.get("http://silvia:8081/status").then( res => {
        this.mode = res.data.Mode.toLowerCase()
        this.sp = res.data.CurrentSetpoint
        this.brewTime = res.data.BrewTime
        this.temp = res.data.CurrentTemperature
        this.temperature.datasets[0].data.shift()
        this.temperature.datasets[0].data.push(this.temp)
        this.temperature.datasets[1].data.shift()
        this.temperature.datasets[1].data.push(this.mode === 'off' ? 0 : this.sp)
      })
      this.$refs.chart.chart.update(0)
    }
  },
  created: function() {
    setInterval(this.restUpdateStatus,1000)
  },
  data() {
    return {
      mode: "steam",
      sp: 0,
      brewTime: 0,
      brew:100,
      steam:140,
      temp: 0,
      temperature: {
       labels:(function() { 
          let array = []
          for (let i = 0; i < 180; i++) {
            array.push(180 - i)
          }
          return array 
        })(),
        datasets: [
          {
            label: 'Boiler Temp',
            data:(function() { 
              let array = []
              for (let i = 0; i < 180; i++) {
                array.push(0)
              }
              return array 
            })(),
            fill: true,
            pointRadius: 0,
            //borderColor: 'rgba(109,117,125,1)',
            backgroundColor: 'rgba(109,117,125,0.3)',
          },
          {
            label: 'Setpoint',
            data:(function() { 
              let array = []
              for (let i = 0; i < 180; i++) {
                array.push(0)
              }
              return array 
            })(),
            fill: false,
            pointRadius: 0,
            borderColor: 'rgba(109,117,125,1)',
          }
        ]
      },
      graphOpts: {
        scales: {
          yAxes: [{
            ticks: {
              fontSize: 16,
              suggestedMin:0,
              suggestedMax: 150,
              callback: function (val) {
                return val + '°C'
              }
            }
          }],
          xAxes: [{
            ticks: {
              maxRotation: 0,
              autoSkipPadding: 50,
              fontSize: 16,
              callback: function (val) {
                return `${val}s`
              }
            }
          }]
        },
        legend: {
          display: true
        }
      }
    }
  }
}
</script>

