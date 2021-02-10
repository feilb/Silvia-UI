<template>
  <div class="p-fluid p-mr-4">
    <h3>Auto-Off</h3>
    <div class="p-field p-grid">
      <div class="p-col p-as-center">
        <InputSwitch v-model="enabled" @update:modelValue="setAutoOff" />
      </div>
    </div>
    <Divider />
    <h3>Auto-Off Duration</h3>
    <div class="p-field p-grid">
      <div class="p-col-2">
        <h3>{{duration}} min</h3>
      </div>
      <div class="p-col p-as-center">
        <Slider id="autoOffDuration"
          v-model="duration"
          @slideend="setDuration($event.value)"
          
          @touchstart.prevent="handleTouchStart"
          @mousedown.prevent="handleTouchStart"

          @touchend.prevent="handleTouchEnd"
          @mouseup.prevent="handleTouchEnd"
          :min="10"
          :max="180"
          :step="5"
        />
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
import InputSwitch from 'primevue/inputswitch'
import Divider from 'primevue/divider'

export default {
  name: 'SetpointPanel',
  components: {
    Slider,
    Divider,
    InputSwitch
  },
  setup() {
    const enabled = ref(true)
    const duration = ref(0)

    let pauseUpdate = false

    let interval

    async function getValues() {
      try {
        let resp = await axios.get('http://silvia:8081/autooff')

        enabled.value = resp.data.Value
      } catch (e) {
        console.error(e)
      }

      try {
        let resp = await axios.get('http://silvia:8081/autooff/duration')

        duration.value = resp.data.Value
      } catch (e) {
        console.error(e)
      }
    }

    async function setAutoOff(enable) {
      try {
        if (enable) {
          await axios.post('http://silvia:8081/autooff/enable')
        } else {
          await axios.post('http://silvia:8081/autooff/disable')
        }

        enabled.value = enable
      } catch (e) {
        console.error(e)
      }
    }

    async function setDuration(val) {
      try {
        await axios.post('http://silvia:8081/autooff/duration', { Value: val })

        duration.value = val
      } catch (e) {
        console.error(e)
      }
    }

    function handleTouchStart() {
      pauseUpdate = true
    }

    function handleTouchEnd() {
      pauseUpdate = false
    }

    onMounted(() => {
      getValues()

      // sync periodically
      interval = setInterval(() => {
        if (!pauseUpdate) {
          getValues()
        }
      }, 1000)
    })

    onUnmounted(() => clearInterval(interval))

    return {
      enabled,
      duration,
      setAutoOff,
      setDuration,
      handleTouchStart,
      handleTouchEnd
    }

  },
}
</script>