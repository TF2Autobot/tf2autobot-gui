<template>
    <table class="table table-hover">
        <thead>
            <tr>
                <th scope="col">SKU</th>
                <th scope="col">Autoprice</th>
                <th></th>
                <th scope="col">Name</th>
                <th scope="col">Intent</th>
                <th scope="col">Buy price</th>
                <th scope="col">Sell price</th>
                <th scope="col">Minimum stock</th>
                <th scope="col">Maximum stock</th>
            </tr>
        </thead>
        <tbody>
            <tr class="item-list m-1" v-for="item in filtered" :key="item.sku" @click="itemClick(item, $event)">
                <td>
                    <a :href="item.statslink" target="_blank" v-on:click.stop="">{{item.sku}}</a>
                </td>
                <td>
                    <b :class='{disabled: !item.autoprice}' class="autoprice-symbol">
                        $
                    </b>
                </td>
                <td :src="item.style.img_small" style="background-size: contain; background-position: center; background-repeat: no-repeat;" :style="{ backgroundImage: `url( ${item.style.image_small} ), url( ${item.style.effect} )`, backgroundColor: item.style.quality_color, borderStyle: item.style.craftable? false : 'dashed', opacity: item.enabled?1:0.5, borderColor: item.style.border_color}"
                    class="image">
                    <svg class="bi bi-check item-check" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" v-if="multiSelect.includes(item.sku)">
                        <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
                    </svg>
                </td>
                <td>{{item.name}}</td>
                <td>{{ item.intent === 2 ? "Bank" : item.intent === 1 ? "Sell" : "buy" }}</td>
                <td >{{item.buy.string}}</td>
                <td >{{item.sell.string}}</td>
                <td>{{item.min}}</td>
                <td>{{item.max}}</td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <th scope="col">SKU</th>
                <th scope="col">Autoprice</th>
                <th></th>
                <th scope="col">Name</th>
                <th scope="col">Intent</th>
                <th scope="col">Buy price</th>
                <th scope="col">Sell price</th>
                <th scope="col">Minimum stock</th>
                <th scope="col">Maximum stock</th>
            </tr>
        </tfoot>
    </table>
</template>

<script lang="ts">
import item from './gridItem.vue'
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

<style scoped lang="scss">
.image {
    width: 64px;
    height: 64px;
}
.item-list .autoprice-symbol {
    color: #29a30e;
}
.item-list .autoprice-symbol.disabled {
    color: #cccccc;
}
.item-list{
    width: 100%;
    height: 64px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 2px solid black;
    border-radius: 5px;
    position: relative;
}
</style>
