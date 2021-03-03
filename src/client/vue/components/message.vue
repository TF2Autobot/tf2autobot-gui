<template>
    <div class="alert d-flex" :class="'alert-' + msg_type" role="alert">
        <div>
            <slot></slot>
        </div>
        <button type="button" class="btn-close ms-auto" aria-label="Close" @click="$emit('close', toRemove)">
        </button>
    </div>
</template>

<script lang="ts">
export default {
    emits: ['close'],
    props: {
        toRemove: Number,
        msg_type: String
    }
}
</script>

<style scoped>

</style>
