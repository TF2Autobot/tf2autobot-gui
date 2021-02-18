import Vue from 'vue'
import index from './vue/index.vue'

new Vue({
    render: h => h(index)
}).$mount(
    document.body
)
//document.querySelector('html').innerHTML = '<h1 style="text-align: center">Not implemented<h1>';
