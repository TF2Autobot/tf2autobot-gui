<template>
    <div class="alert" :class="msg_type" role="alert">
        <slot></slot>
        <button type="button" class="close" @click="$emit('close', toRemove)">
            <span>&times;</span>
        </button>
    </div>
</template>

<script lang="ts">
export default {
    props: ['toRemove', 'msg_type']
}
</script>

<style scoped>

</style>
