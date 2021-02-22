<template>
    <div>
        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#test">Launch modal</button> -->
        <message v-for="(msg, index) in this.error_messages" :key="index" :to-remove=index :msg_type=msg.type @close="msgClose">{{msg.msg}}</message>
        <modal id="test" title="ok"></modal>
        <item-grid v-if="grid" :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]"></item-grid>
        <item-list v-else :pricelist="pricelist" :filter="filterPricelist" :multi-select="[]"></item-list>
    </div>
</template>

<script lang="ts">
import message from './components/message.vue';
import modal from './components/modal.vue';
import itemGrid from './components/itemGrid.vue';
import itemList from './components/itemList.vue';
import {Pricelist, PricelistItem} from "../../common/types/pricelist";

interface Message {
    msg: String;
    type: "Success"|"Danger"|"Warning"|"info";
}

export default {
    components: {
        message,
        modal,
        itemGrid,
        itemList
    },
    data() {
        return {
            error_messages: [] as Message[],
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
            this.error_messages.splice(msg,1);
        },
        loadItems() {
            //TODO IMPLEMENT IN BACKEND
           fetch('/pricelist')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.pricelist = data.pricelist;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    },
    created() {
        this.loadItems();
    }
}
</script>
