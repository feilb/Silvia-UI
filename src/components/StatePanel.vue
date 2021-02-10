<template>
  <PushSwitch
    @toggle="handlePowerPush()" 
    :checked="power"

    :imgOff="require(`@/assets/power_grey.svg`)" 
    :imgOn="require(`@/assets/power_orange.svg`)"

    height=40 
    inactiveBorder
    class="p-mb-3 p-mx-3 p-ai-stretch"
    style="padding: 17px 0"
  />
  <PushSwitch 
    @toggle="handleModePush('brew')" 
    :checked="brew"
    :disabled="!power" 
    
    :imgOff="require(`@/assets/brew_grey.svg`)"
    :imgOn="require(`@/assets/brew_orange.svg`)"
    
    height=70
    class="p-mt-5 p-mx-3 p-ai-stretch"
  />
  <PushSwitch
    @toggle="handleModePush('water')" 
    :checked="water"
    :disabled="!power"
  
    :imgOff="require(`@/assets/water_grey.svg`)"
    :imgOn="require(`@/assets/water_orange.svg`)"
  
    height=70
    class="p-my-3 p-mx-3 p-ai-stretch"
  />
  <PushSwitch
    @toggle="handleModePush('steam')" 
    :checked="steam"
    :disabled="!power"
    
    :imgOff="require(`@/assets/steam_grey.svg`)"
    :imgOn="require(`@/assets/steam_orange.svg`)"

    height=70
    class="p-my-3 p-mx-3 p-ai-stretch"
  />
</template>

<style scoped>
.icon {
  font-size: 2rem;
}
</style>

<script>
import axios from 'axios'

import { ref, computed, onMounted, onUnmounted} from 'vue'
import PushSwitch from './PushSwitch'


export default {
  name: 'StatePanel',
  components: {
    PushSwitch
  },
  setup() {
    const mode = ref('')
    const power = computed(() => mode.value !== 'off')
    const brew = computed(() => mode.value === 'brew')
    const water = computed(() => mode.value === 'water')
    const steam = computed(() => mode.value === 'steam')

    let interval

    async function getState() {
      try {
        const resp = await axios.get('http://silvia:8081/mode')
        mode.value = resp.data.Value.toLowerCase()
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(() => {
      getState()
      //sync periodically
      interval = setInterval(getState, 1000)
    })

    onUnmounted(() => clearInterval(interval))

    async function handlePowerPush() {
      let newMode = mode.value === 'off' ? 'heat' : 'off'

      try {
        await axios.post(`http://silvia:8081/mode/${newMode}`)

        mode.value = newMode
      } catch (e) {
        console.error(e)
      }
    }

    async function handleModePush(m) {
      if (mode.value === 'off') {
        return
      }

      let newMode = mode.value === m ? 'heat' : m

      try {
        await axios.post(`http://silvia:8081/mode/${newMode}`)

        mode.value = newMode
      } catch (e) {
        console.error(e)
      }
    }

    return {
      mode,
      power,
      brew,
      water,
      steam,
      handleModePush,
      handlePowerPush
    }
  }
}
</script>

