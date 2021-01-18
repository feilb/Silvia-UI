<template>
  <PushSwitch
    @toggle="$emit('power-clicked')" 
    :checked="power"

    :imgOff="require(`@/assets/power_grey.svg`)" 
    :imgOn="require(`@/assets/power_orange.svg`)"

    height=40 
    inactiveBorder
    class="p-mb-3 p-mx-3 p-ai-stretch"
    style="padding: 17px 0"
  />
  <PushSwitch 
    @toggle="$emit('brew-clicked')" 
    :checked="brew"
    :disabled="!power" 
    
    :imgOff="require(`@/assets/brew_grey.svg`)"
    :imgOn="require(`@/assets/brew_orange.svg`)"
    
    height=70
    class="p-mt-5 p-mx-3 p-ai-stretch"
  />
  <PushSwitch
    @toggle="$emit('water-clicked')" 
    :checked="water"
    :disabled="!power"
  
    :imgOff="require(`@/assets/water_grey.svg`)"
    :imgOn="require(`@/assets/water_orange.svg`)"
  
    height=70
    class="p-my-3 p-mx-3 p-ai-stretch"
  />
  <PushSwitch
    @toggle="$emit('steam-clicked')" 
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

export default {
  name: 'StatePanel',
  data() {
    return {
      powerSwitch: false
    }
  },
  props: {
    power: Boolean,
    brew: Boolean,
    water: Boolean,
    steam: Boolean,
  },
  emits: ['power-clicked', 'brew-clicked', 'water-clicked', 'steam-clicked']
}
</script>

