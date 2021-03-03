<template>
    <div>
        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#test">Launch modal</button> -->
        <message v-for="(msg, index) in this.messages" :key="index" :to-remove=index :msg_type=msg.type @close="msgClose">{{msg.msg}}</message>
        <bulk-add ref="bulkAdd" :reloadItems="loadItems" @message="this.addMessage"></bulk-add>
        <price-modal ref="priceModal"></price-modal>
        <button @click="$refs.priceModal.show()"></button>
        <item-grid v-if="grid" :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]"></item-grid>
        <item-list v-else :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]"></item-list>
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
            pricelist: [] as Pricelist,
            grid: false,
        }
    },
    methods: {
        filterPricelist(item) {
            return true;
        },
        msgClose(msg) {
            this.messages.splice(msg,1);
        },
        loadItems() {
           fetch('/pricelist')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.pricelist = data.pricelist;
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        },
        addMessage(msg: Message) {
            this.messages.push(msg);
        }
    },
    created() {
        this.loadItems();
    }
}
</script>
