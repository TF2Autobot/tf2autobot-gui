<template>
    <div class="d-flex mt-1 justify-content-center flex-wrap">
        <item v-for="item in filtered" :key="item.sku" :item="item"></item>
    </div>
</template>

<script lang="ts">
import item from '../components/gridItem.vue'
export default {
    props: {
        pricelist: Array,
        filter: Function,
        multiSelect: Array
    },
    name: "itemGrid.vue",
    components: {
        item
    },
    computed: {
        filtered() {
            return this.pricelist.filter(this.filter);
        }
    }
}
</script>
