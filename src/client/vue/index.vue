<template>
    <div>
        <!-- <button type="button" data-bs-toggle="modal" data-bs-target="#test">Launch modal</button> -->
        <message v-for="(msg, index) in this.messages" :key="index" :to-remove=index :msg_type=msg.type @close="msgClose">{{msg.msg}}</message>
        <modal id="test" title="ok"></modal>
        <div class="d-flex">
            <item :item="{name: 'helloW', enabled: true, style: {image_small: 'https://steamcdn-a.akamaihd.net/apps/440/icons/pile_of_junk2.c5823a4ad9cec27d29ca0ddf049a5af0796ea9bd.png'}, intent: 2, buy: {string: '10Keys'}, sell: {string: '50keys'}}"></item>
            <item :item="{name: 'helloA', autoprice: true,  style: {image_small: 'https://steamcdn-a.akamaihd.net/apps/440/icons/pile_of_junk2.c5823a4ad9cec27d29ca0ddf049a5af0796ea9bd.png'}, intent: 1, buy: {}, sell: {}}"></item>
        </div>
    </div>
</template>

<script lang="ts">
import message from './components/message.vue';
import modal from './components/modal.vue';
import item from './components/gridItem.vue';

interface Message {
    msg: String;
    type: "Success"|"Danger"|"Warning"|"info";
}

interface Item { // Use globally / add missing
    name: String;
    buy: {
        string: String;
    };
    sell: {
        string: String;
    };
    style: {
        image_small: String;
        effect: String;
        quality_color: String;
        craftable: Boolean;
        border_color: String;
        killstreak: String;
    };
    enabled: Boolean;
    intent: Number;
    autoprice: Boolean;
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
            items: [] as Item[]
        }
    },
    methods: {
        msgClose(msg) {
            this.error_messages.splice(msg,1);
        },
        loadItems() {
            //TODO IMPLEMENT IN BACKEND
           /*fetch('/getItems')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.pricelist = data.pricelist;
                })
                .catch((error) => {
                    console.error('Error:', error);
                });*/
        }
    },
    created() {
        this.loadItems();
    }
}
</script>
