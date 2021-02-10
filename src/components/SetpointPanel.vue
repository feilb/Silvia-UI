<template>
  <div class="p-fluid p-mr-4">
    <h3>Brew Setpoint</h3>
    <div class="p-field p-grid">
      <div class="p-col-2">
        <h3>{{brew}}°C</h3>
      </div>
      <div class="p-col p-as-center">
        <Slider 
          id="brewSP" 
          v-model="brew"
          @slideend="setBrewSetpoint($event.value)"


          @touchstart.prevent="handleTouchStart"
          @mousedown.prevent="handleTouchStart"

          @touchend.prevent="handleTouchEnd"
          @mouseup.prevent="handleTouchEnd"
          :min="90"
          :max="110"
        />
      </div>
    </div>
    <Divider />
    <h3>Steam Setpoint</h3>
    <div class="p-field p-grid">
      <div class="p-col-2">
        <h3>{{steam}}°C</h3>
      </div>
      <div class="p-col p-as-center">
        <Slider id="steamSP" v-model="steam" @slideend="setSteamSetpoint($event.value)" :min="100" :max="160" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
import axios from 'axios'

import { ref, onMounted, onUnmounted } from 'vue'

import Slider from 'primevue/slider'
import Divider from 'primevue/divider'

export default {
  name: 'SetpointPanel',
  components: {
    Slider,
    Divider
  },
  setup() {
    const brew = ref(0)
    const steam = ref(0)

    let pauseUpdate = false

    let interval

    async function getSetpoints() {
      try {
        let resp = await axios.get('http://silvia:8081/setpoint/brew')

        brew.value = resp.data.Value
      } catch (e) {
        console.error(e)
      }

      try {
        let resp = await axios.get('http://silvia:8081/setpoint/steam')

        steam.value = resp.data.Value
      } catch (e) {
        console.error(e)
      }
    }

    async function setBrewSetpoint(val) {
      try {
        await axios.post('http://silvia:8081/setpoint/brew', { Value: val })

        brew.value = val
      } catch (e) {
        console.error(e)
      }
    }

    async function setSteamSetpoint(val) {
      try {
        await axios.post('http://silvia:8081/setpoint/steam', { Value: val })

        steam.value = val
      } catch (e) {
        console.error(e)
      }
    }

    function handleTouchStart() {
      console.log('touchstart')
      pauseUpdate = true
    }

    function handleTouchEnd() {
      console.log('touchend')
      pauseUpdate = false
    }

    onMounted(() => {
      getSetpoints()

      // sync periodically
      interval = setInterval(() => {
        if (!pauseUpdate) {
          getSetpoints()
        }
      }, 1000)
    })

    onUnmounted(() => clearInterval(interval))

    return {
      brew,
      steam,
      setBrewSetpoint,
      setSteamSetpoint,
      handleTouchStart,
      handleTouchEnd
    }

  },
}
</script>