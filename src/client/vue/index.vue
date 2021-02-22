<template>
    <div>
        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#test">Launch modal</button> -->
        <message v-for="(msg, index) in this.messages" :key="index" :to-remove=index :msg_type=msg.type @close="msgClose">{{msg.msg}}</message>
        <modal id="test" title="ok"></modal>
        <div class="d-flex">
            <item v-for="item in this.pricelist" :item="item"></item>
        </div>
    </div>
</template>

<script lang="ts">
import message from './components/message.vue';
import modal from './components/modal.vue';
import item from './components/gridItem.vue';
import {Pricelist, PricelistItem} from "../../common/types/pricelist";

interface Message {
    msg: String;
    type: "Success"|"Danger"|"Warning"|"info";
}

export default {
    components: {
        message,
        modal,
        item
    },
    data() {
        return {
            error_messages: [] as Message[],
            items: [] as PricelistItem[],
            pricelist: [] as Pricelist
        }
    },
    methods: {
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
