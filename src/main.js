import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import InputSwitch from 'primevue/inputswitch'
import Slider from 'primevue/slider'
import Chart from 'primevue/chart'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Divider from 'primevue/divider'

import 'primevue/resources/primevue.css'
import 'primevue/resources/themes/saga-orange/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

import PushSwitch from './components/PushSwitch.vue'
import StatePanel from './components/StatePanel.vue'
import SetpointPanel from './components/SetpointPanel.vue'

const app = createApp(App)

app.use(PrimeVue)

app.component('PushSwitch', PushSwitch)
app.component('Slider', Slider)
app.component('Chart', Chart)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Divider', Divider)
app.component('InputSwitch', InputSwitch)

app.component('StatePanel', StatePanel)
app.component('SetpointPanel', SetpointPanel)

app.mount('#app')
