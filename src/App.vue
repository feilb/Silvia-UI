<template>
  <div class="p-grid p-d-flex" style="height:100%">
    <div class="p-col-3" id="left-nav">
      <StatePanel
        :power="mode != 'off'"
        :brew="mode == 'brew'"
        :water="mode == 'water'"
        :steam="mode == 'steam'"

        @power-clicked="handlePower"
        @brew-clicked="handleBrew"
        @water-clicked="handleWater"
        @steam-clicked="handleSteam"
      />
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
          <SetpointPanel />
        </TabPanel>
        <TabPanel>
          <template #header>
            <i class="pi pi-cog icon"></i>
          </template>
          Settings
        </TabPanel>
        <TabPanel :disabled="true">
          <template #header>
            <span class="info">{{temp.toFixed(1)}}°C | {{sp.toFixed(1)}}°C</span>
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

canvas {
  height: 400px
}
</style>

<script>
import axios from "axios"

export default {
  name: 'App',
  components: {
  },
  methods: {
    thisTest() {
      console.log('chart?')
      console.log(this.$refs.chart)
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
        this.temp = res.data.CurrentTemperature
        this.temperature.datasets[0].data.shift()
        this.temperature.datasets[0].data.push(this.temp)
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
      brew:100,
      steam:140,
      temp: 0,
      temperature: {
        labels:(function() { 
          let array = []
          for (let i = 0; i < 60; i++) {
            array.push('')
          }
          return array 
        })(),
        datasets: [
          {
            label: 'Temperature',
            data:(function() { 
              let array = []
              for (let i = 0; i < 60; i++) {
                array.push(0)
              }
              return array 
            })(),
            fill: false,
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

