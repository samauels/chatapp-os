

// document.body.insertAdjacentHTML('afterbegin', require('./app.html'));

import Vue from 'vue'
import Chat from 'vue-beautiful-chat'

Vue.use(Chat)

import chatone from "./app.vue";

new Vue({
    el: '#widget',    
    render: h => h(chatone),
    
});
