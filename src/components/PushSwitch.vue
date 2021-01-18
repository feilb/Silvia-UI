<template>
  <div class="box" :class="{ 'box-on': checked, 'inactive-border': inactiveBorder && !checked }" @click="toggle">
    <img :src="img" :class="{ 'img-disabled': disabled }" :style="hs">
  </div>
</template>

<script>

export default {
  name: 'PushSwitch',
  props: {
    imgOn: String,
    imgOff: String,
    height: String,
    disabled: Boolean,
    checked: Boolean,
    inactiveBorder: Boolean
  },
  computed: {
    hs: function () {
      //let vm = this.marginPct * 0.5
      let img = this.height
      let a = "height: " + img + "px"
      return a
    },
    img: function () {
      return this.checked ? this.imgOn : this.imgOff
    }
  },
  emits: ['toggle'],
  methods: {
    toggle: function() {
      if(!this.disabled) {
        this.$emit('toggle', !this.checked)
      }
    }
  }
}
</script>

<style scoped>
.box {
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-style: solid;
  border-width: 2px;
  border-color: rgba(109,117,125,0.0)
}

.box-on {
  border-color: rgba(255,194,0,1)
}

.inactive-border {
  border-color: rgba(109,117,125,0.3)
}

.img-disabled {
  opacity: 0.25;
}

</style>