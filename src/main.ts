import { createApp } from 'vue'
import 'reset.css';
import App from './App.vue'
import pinia from '@/store'
import router from '@/router'
import { Icon } from '@iconify/vue';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入本地化语言
import dragDirective from './components/drag/drag';

dayjs.locale('zh-cn'); // 使用本地化语言

const app = createApp(App);
app.component('VIcon', Icon);
app.use(router);
app.use(pinia);
app.directive('drag', dragDirective);

app.mount('#app');
