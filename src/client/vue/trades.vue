<template>
    <div>
        <div style="text-align: center;">
            <h1>Trades</h1>
        </div>
        <div class="row">
            <div class="col">
                <input class="form-control mr-sm-2" id="searchPricelist" type="search" placeholder="Search for trade or partner ID" aria-label="Search" autocomplete="off" v-model="search">
            </div>
            <div class="col">
                <select name="intent" class="form-control" id="order" v-model="order">
                    <option value="1">newest to old</option>
                    <option value="0">oldest to new</option>
                </select>
                <label for="order">Sort trades by time</label>
            </div>
            <div class="col">
                <div class="pretty p-switch p-fill">
                    <input type="checkbox" name="acceptedOnly" id="acceptedOnly" v-model="acceptedOnly"/>
                    <div class="state p-success">
                        <label>Accepted only</label>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-3" id="tradeList">
            <div class="p-2 rounded border m-2 trade" v-for="trade in tradeList" :key="trade.id" :class="trade.accepted? '': 'declined'">
                <div>
                    {{trade.datetime}}: Trade <b>#{{trade.id}}</b> with <a :href="'https://steamcommunity.com/profiles/' + trade.partner"  target="_blank" class="steam-profile">{{trade.partner}}.</a>
                    {{trade.accepted? `Profit: ${trade.profit}`: ` Trade unsuccessfull, reason: ${trade.lastState}.`}}
                </div>
                <div class="row">
                    <div class="col item-list">
                        <div>Our: {{trade.hasOwnProperty('value')? `${trade.value?.our?.keys} keys, ${trade.value?.our?.metal} metal`: ''}}</div>
                        <div class="d-flex justify-content-center flex-wrap">
                            <grid-item v-for="item in trade.items.our" :key="item.sku" :item="Object.assign({},items[item.sku], item)"></grid-item>
                        </div>
                    </div>
                    <div class="col item-list">
                        <div>Their: {{trade.hasOwnProperty('value')? `${trade.value?.their?.keys} keys, ${trade.value?.their?.metal} metal`: ''}}</div>
                        <div class="d-flex justify-content-center flex-wrap">
                            <grid-item v-for="item in trade.items.their" :key="item.sku" :item="Object.assign({},items[item.sku], item)"></grid-item>
                        </div>
                    </div>
                </div>
            </div>
            <button class="p-2" v-if="tradeList.length >= toShow" @click="toShow+=25">
                Show More
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import gridItem from './components/gridItem.vue';
import priceModal from "./parts/priceModal.vue";
import message from "./components/message.vue";
import bulkAdd from "./parts/bulkAddModal.vue";
import itemList from "./parts/itemList.vue";
interface TradeList {

}

export default {
    name: 'trades.vue',
    data() {
        return {
            tradeList: [] as any[],
            error: '',
            items: [] as any[],
            toShow: 50,
            search: '',
            order: 1,
            acceptedOnly: 0,
            tradeCount: 0
        }
    },
    components: {
        gridItem
    },
    methods: {
        loadTrades() {
            fetch('', {headers: {
                    'Accept': 'application/json',
                }})
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if(data.success){
                        this.tradeList = data.data.trades;
                        this.items = data.data.items;
                    } else {
                        this.error = ""
                    }
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        },
    },
    created() {
        this.loadTrades();
    }
};
</script>

<style scoped>

</style>
