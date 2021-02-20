<template>
    <div>
        {{mess}}}
        <h1 v-for="(msg, index) in error_messages">{{msg}}}</h1>
        {{this.error_messages}}
        <message v-for="(msg, index) in this.error_messages" msg_type="error" to-remove="{{index}}">{{msg}}</message>
    </div>
</template>

<script lang="ts">
import message from './message.vue'
export default {
    components: {
        message
    },
    data() {
        return {
            mess: 'hello world',
            error_messages: [
                'a',
                'b',
                'testc'
            ]
        }
    }
}
</script>
