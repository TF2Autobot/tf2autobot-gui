<template>
    <div class="d-flex mt-1 justify-content-center flex-wrap">
        <item v-for="item in filtered" :key="item.sku" :item="item" @itemClick="$emit('itemClick', $event)"></item>
    </div>
</template>

<script lang="ts">
import item from '../components/gridItem.vue'
import {PropType} from "vue";
import {Pricelist} from "../../../common/types/pricelist";
export default {
    props: {
        pricelist: Object as PropType<Pricelist>,
        filter: Function,
        multiSelect: Array
    },
    name: "itemGrid.vue",
    components: {
        item
    },
    emits: ['itemClick'],
    computed: {
        filtered: function (){
            // @ts-ignore
            return this.pricelist ? Object.values(this.pricelist).filter(this.filter) : [];
        }
    }
}
</script>
