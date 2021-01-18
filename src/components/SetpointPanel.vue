<template>
  <div class="p-fluid p-mr-4">
    <h3>Brew Setpoint</h3>
    <div class="p-field p-grid">
      <div class="p-col-2">
        <h3>{{brewSetpoint}}°C</h3>
      </div>
      <div class="p-col p-as-center">
        <Slider id="brewSP" v-model="brewSetpoint" :min="90" :max="110" />
      </div>
    </div>
    <Divider />
    <h3>Steam Setpoint</h3>
    <div class="p-field p-grid">
      <div class="p-col-2">
        <h3>{{steamSetpoint}}°C</h3>
      </div>
      <div class="p-col p-as-center">
        <Slider id="steamSP" v-model="steamSetpoint" :min="100" :max="160" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script>
export default {
  name: 'SetpointPanel',
  data() {
    return {
      brewSetpoint: 100,
      steamSetpoint: 140
    }
  }
}
</script>