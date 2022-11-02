import Vue from 'vue'
import '@/style/index.less'
import App from './App.vue'
import globalMixin from "@/mixin/global-mixin";
import 'windi.css';
import Loading from "@/components/loading/index.vue";

Vue.config.productionTip = false
Vue.use(globalMixin);
Vue.component('loading', Loading)

const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
app.$mount();
