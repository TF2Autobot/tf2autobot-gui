<template>
    <modal id="bulkModal" title="Add items in bulk">
        <template v-slot:body>
            <div class="form-group">
                <label for="url">Items</label>
                <textarea rows="5" class="form-control" id="url" name="input" placeholder="Add the backpack.tf stats page, sku, or the items name. Seperate multiple inputs by a new line. See console for speed" required v-model="input"></textarea>
            </div>
            <div class="form-row">
                <div class="col">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" name="autoprice" id="autoprice" v-model="autoprice"/>
                        <label class="form-check-label" for="autoprice">Autoprice</label>
                    </div>
                </div>
            </div>
            <div class="form-row" v-if="!autoprice&&(intent!=1)">
                <div class="col">
                    <label for="buykeys">Buy keys</label>
                    <input type="number" class="form-control" id="buykeys" name="buykeys" min="0" placeholder="Keys" v-model="buy.keys">
                </div>
                <div class="col">
                    <label for="buymetal">Buy metal</label>
                    <input type="number" class="form-control"  id="buymetal" name="buymetal" min="0" placeholder="Metal" step="any" v-model="buy.metal">
                </div>
            </div>
            <div class="form-row" v-if="!autoprice&&(intent!=0)">
                <div class="col">
                    <label for="sellkeys">Sell keys</label>
                    <input type="number" class="form-control" id="sellkeys" name="sellkeys" min="0" placeholder="Keys" v-model="sell.keys">
                </div>
                <div class="col">
                    <label for="sellmetal">Sell metal</label>
                    <input type="number" class="form-control" id="sellmetal" name="sellmetal" min="0" placeholder="Metal" step="any" v-model="sell.metal">
                </div>
            </div>
            <div class="form-row">
                <div class="col">
                    <label for="intent">Intent</label>
                    <select name="intent" class="form-control" id="intent" v-model="intent">
                        <option selected="selected" value=2>Bank (buy and sell)</option>
                        <option value=0>Buy</option>
                        <option value=1>Sell</option>
                    </select>
                </div>
                <div class="col">
                    <label for="minimum">Minimum stock</label>
                    <input type="number" class="form-control" id="minimum" name="min" min="0" required v-model="min">
                </div>
                <div class="col">
                    <label for="maximum">Maximum stock</label>
                    <input type="number" class="form-control" id="maximum" name="max" min="0" required v-model="max">
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <button type="submit" class="btn btn-primary" @click.prevent="bulkAdd()">Add</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </template>
    </modal>
</template>

<script lang="ts">
import modal from '../components/modal.vue'
export default {
    components: {
        modal,
    },
    data () {
        return {
            input: '',
            autoprice: true,
            intent: 2,
            buy: {
                metal: 0,
                keys: 0
            },
            sell: {
                metal: 0,
                keys: 0
            },
            max: 1,
            min: 0,
            modal: null
        }
    },
    props: ['reloadItems'],
    emits: ['message'],
    methods: {
        show: function(){
            this.modal.show();
        },
        bulkAdd: function() {
            const postData = {
                input: this.input,
                intent: this.intent,
                min: this.min,
                max: this.max,
                autoprice: this.autoprice,
                buy_keys: this.buy.keys,
                buy_metal: this.buy.metal,
                sell_keys: this.sell.keys,
                sell_metal: this.sell.metal
            };
            this.$emit('message',{msg: 'Bulk add started, it might take a while.', type:'secondary'});
            this.modal.hide();
            fetch('/pricelist', { //TODO: IMPLEMENT BACKEND
                method: 'POST',
                body: JSON.stringify(postData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    this.$emit('message', {type: data.msg.type, message: data.msg.message});
                    this.reloadItems();
                })
                .catch((error) => {
                    this.$emit('message', {type: 'danger', msg: 'Error while adding items:' + error});
                });
        },
    },
    mounted(){
        // @ts-ignore
        this.modal = new bootstrap.Modal(document.getElementById('bulkModal'));
    },
    name: "bulkAddModal"
}
</script>

<style scoped lang="scss">
</style>
