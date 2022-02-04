<template>
    <div>
        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#test">Launch modal</button> -->
        <message v-for="(msg, index) in this.messages" :key="index" :to-remove=index :msg_type=msg.type @close="msgClose">{{msg.msg}}</message>
        <bulk-add ref="bulkAdd" :reloadItems="loadItems" @message="this.addMessage"></bulk-add>
        <price-modal ref="priceModal" @item="itemUpdate($event)"></price-modal>
        <button @click="$refs.priceModal.show()">Add Item</button>
        <button @click="$refs.bulkAdd.show()">Bulk Add Items</button>
        <button @click="grid=!grid">Toggle Grid</button>
        <item-grid v-if="grid" :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]" @itemClick="$refs.priceModal.show(true, $event)"></item-grid>
        <item-list v-else :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]" @itemClick="$refs.priceModal.show(true, $event)"></item-list>
    </div>
</template>

<script lang="ts">
import message from './components/message.vue';
import bulkAdd from './parts/bulkAddModal.vue';
import itemGrid from './parts/itemGrid.vue';
import itemList from './parts/itemList.vue';
import priceModal from './parts/priceModal.vue'
import {Pricelist, PricelistItem} from "../../common/types/pricelist";
//TODO: ADD listing NOTES, promoted, group
interface Message {
    msg: String;
    type: "Success"|"Danger"|"Warning"|"info";
}

export default {
    components: {
        priceModal,
        message,
        bulkAdd,
        itemGrid,
        itemList
    },
    data() {
        return {
            messages: [] as Message[],
            items: [] as PricelistItem[],
            pricelist: {} as Pricelist,
            grid: false,
        }
    },
    methods: {
        filterPricelist(item: any) {
            return true;
        },
        msgClose(msg: any) {
            this.messages.splice(msg,1);
        },
        loadItems() {
           fetch('/pricelist')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.pricelist = data;
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        },
        addMessage(msg: Message) {
            this.messages.push(msg);
        },
        itemUpdate(item: {type: string, data: PricelistItem}){
            if(item.type === 'del') this.pricelist.splice(this.pricelist.findIndex((e: PricelistItem) => e.sku === item.data.sku), 1);
            else if(item.type === 'patch') this.pricelist[this.pricelist.findIndex((e: PricelistItem) => e.sku === item.data.sku)] = this.item.data;
            else this.pricelist.push(item.data);
        }
    },
    created() {
        this.loadItems();
    }
}
</script>
