<template>
    <modal id="priceModal" :title="edit ? 'Edit item' : 'Add item'">
        <template v-slot:body>
            <div class="row mb-4">
                <div class="col">
                    <item-search v-model="item.name" id="search" :disable="edit" @item="itemSelected"></item-search>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="enabled" id="enabled" v-model="item.enabled" :disabled="!edit"/>
                        <label class="form-check-label" for="enabled">Enabled</label>
                    </div>
                </div>
                <div class="col-6" v-if="item.enabled">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="autoprice" id="priceautoprice" v-model="item.autoprice"/>
                        <label class="form-check-label" for="priceautoprice">Autoprice</label>
                    </div>
                </div>
            </div>
            <div class="form-row">

            </div>
            <div class="row" v-if="item.enabled&&(item.intent!==1)">
                <div class="col">
                    <label for="pricebuykeys">Buy keys</label> <!-- TODO add autoprice back -->
                    <input type="number" class="form-control" id="pricebuykeys" name="buykeys" min="0" placeholder="Keys" required :disabled="item.autoprice" v-model="item.buy.keys">
                </div>
                <div class="col">
                    <label for="pricebuymetal">Buy metal</label>
                    <input type="number" class="form-control" id="pricebuymetal" name="buymetal" min="0" placeholder="Metal" step="any" required :disabled="item.autoprice" v-model="item.buy.metal">
                </div>
            </div>
            <div class="row" v-if="item.enabled&&(item.intent!==0)">
                <div class="col">
                    <label for="pricesellkeys">Sell keys</label>
                    <input type="number" class="form-control" id="pricesellkeys" name="sellkeys" min="0" placeholder="Keys" required :disabled="item.autoprice" v-model="item.sell.keys">
                </div>
                <div class="col">
                    <label for="pricesellmetal">Sell metal</label>
                    <input type="number" class="form-control" id="pricesellmetal" name="sellmetal" min="0" placeholder="Metal" step="any" required :disabled="item.autoprice" v-model="item.sell.metal">
                </div>
            </div>
            <div class="row" v-if="item.enabled">
                <div class="col" id="priceintentdiv">
                    <label for="priceintent">Intent</label>
                    <select name="intent" class="form-control" id="priceintent"  v-model="item.intent">
                        <option value="2">Bank (buy and sell)</option>
                        <option value="0">Buy</option>
                        <option value="1">Sell</option>
                    </select>
                </div>
                <div class="col">
                    <label>Minimum stock</label>
                    <input type="number" class="form-control" id="priceminimum" name="min" min="0" required v-model="item.min">
                </div>
                <div class="col">
                    <label>Maximum stock</label>
                    <input type="number" class="form-control" id="pricemaximum" name="max" min="0" required v-model="item.max">
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button type="button" v-if="!edit" class="btn btn-primary" @click="resetModal()">Clear</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-primary" @click.prevent="saveItem">Save</button>
            <button type="button" v-if="edit" class="btn btn-danger" @click="deleteItem(item)">Delete item</button>
        </template>
    </modal>
</template>

<script lang="ts">
import itemSearch from "../components/itemSearch.vue";
import modal from '../components/modal.vue'
import {Price, PricelistItem} from "../../../common/types/pricelist";
import * as bootstrap from "bootstrap";
interface data {
    edit: boolean;
    item: PricelistItem;
    modal: bootstrap.Modal;
}
export default {
    components: {
        modal,
        itemSearch
    },
    emits: ['item'],
    props: ['reloadItems'],
    data(): data {
        return {
            edit: false,
            item: {} as PricelistItem,
            modal: null,
        }
    },
    methods: {
        itemSelected(e: any) {
            this.item.sku = e.sku;
            this.item.name = e.name;
        },
        show: function(edit: boolean, item?: object) {
            this.resetModal();
            this.edit = edit;
            if(edit) {
                if(item) {
                    this.item = item;
                } else {
                    this.edit = false; // we have no item to edit
                }
            }
            this.modal.show();
        },
        hide: function() {
            this.modal.hide();
        },
        resetModal() {
            this.item = {
                sku: '',
                name: '',
                max: 1,
                min: 0,
                buy: {
                    keys: 0,
                    metal: 0
                },
                sell: {
                    keys: 0,
                    metal: 0
                },
                promoted: 0,
                group: 'all',
                note: {
                    buy: null,
                    sell: null
                },
                enabled: true,
                intent: 2,
                autoprice: true
            };
            this.edit=false;
        },
        saveItem() {
            if (!this.item.sku) {
                return;
            }
            this.hide();
            fetch('/pricelist/item', { //TODO: IMPLEMENT BACKEND
                method: this.edit? 'PATCH':'POST',
                body: JSON.stringify(this.item),
                headers: {
                    'Content-Type': 'application/json',
                },
            })  .then(res => res.json())
                .then(res => {
                    if(typeof res === "object") {
                        this.$emit('item', {type: 'new', data: res});
                    } else {
                        console.error(res);
                    }
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });

        },
        deleteItem() {
            this.hide();
            fetch('/pricelist/item', { //TODO: IMPLEMENT BACKEND
                method: 'DELETE',
                body: JSON.stringify(this.item),
                headers: {
                    'Content-Type': 'application/json',
                }
            })  .then(res => res.json())
                .then(res => {
                    if(typeof res === "object") {
                        this.$emit('item', {type: 'new', data: res});
                    } else {
                        console.error(res);
                    }
                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        }
    },
    created() {
        this.resetModal();
    },
    mounted(){
        this.modal = new bootstrap.Modal(document.getElementById('priceModal'));
    },
    name: "priceModal"
}
</script>

<style scoped lang="scss">
    input:disabled {
        background-color: #bbbbbb;
    }
</style>
