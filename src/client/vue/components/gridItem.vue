<template>
    <div class="item m-1"
         :style="{ backgroundImage: `url( ${item.style.image_small} ), url( ${item.style.effect} )`, backgroundColor: item.style.quality_color, borderStyle: item.style.craftable? false : 'dashed', opacity: item.enabled?1:0.5, borderColor: item.style.border_color}"
         @click="$emit('itemClick', item)">
        <div class="info text-center font-weight-bold" v-if="!selected">
            {{item.name}}
        </div>
        <div class="price" v-if="!selected">
            B: {{item.buy?.string ?? ''}}<br>
            S: {{item.sell?.string ?? ''}}
        </div>
        <svg class="bi bi-check item-check" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" v-else>
            <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z" clip-rule="evenodd"/>
        </svg>
        <div class="ks">
            <b>{{item.style.killstreak}}</b>
        </div>
        <svg v-if='item.intent===2' class='intent-symbol' width="1em" height="1.5em" x="0px" y="0px" viewBox="0 0 489.2 489.2" xml:space="preserve">
            <path d="M481.044,382.5c0-6.8-5.5-12.3-12.3-12.3h-418.7l73.6-73.6c4.8-4.8,4.8-12.5,0-17.3c-4.8-4.8-12.5-4.8-17.3,0l-94.5,94.5 c-4.8,4.8-4.8,12.5,0,17.3l94.5,94.5c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-73.6-73.6h418.8 C475.544,394.7,481.044,389.3,481.044,382.5z"/>
            <path d="M477.444,98l-94.5-94.4c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l73.6,73.6h-418.8c-6.8,0-12.3,5.5-12.3,12.3 s5.5,12.3,12.3,12.3h418.8l-73.6,73.4c-4.8,4.8-4.8,12.5,0,17.3c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l94.5-94.5 C482.244,110.6,482.244,102.8,477.444,98z"/>
        </svg>
        <b v-else-if='item.intent===0' class='intent-symbol'>
            B
        </b>
        <b v-else-if='item.intent===1' class='intent-symbol'>
            S
        </b>
        <b v-if='item.autoprice' class="autoprice-symbol">
            $
        </b>
    </div>
</template>

<script lang="ts">
export default {
    name: "item.vue",
    props: {
        item: Object,
        selected: Boolean
    },
    emits: ['itemClick']
}
</script>

<style scoped lang="scss">
$dark: #212529; //From bootstrap
%unselectable {
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+/Edge */
    user-select: none; /* Standard */
}
.item{
    width: 128px;
    height: 128px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    border: 2px solid black;
    border-radius: 5px;
    position: relative;
}
.autoprice-symbol {
    top: 2px;
    right: 2px;
    position: absolute;
    z-index: 2;
    color: #29a30e;
    @extend %unselectable;
}
.info {
    line-height: 1.2;
    position:relative;
    z-index: 1000;
    width: 100%;
    height: 100%;
    visibility: hidden;
    background-color:rgba(255, 255, 255, 0.7);
    overflow-x: hidden;
    overflow-y: hidden;
    color: $dark;
    @extend %unselectable;
    :hover > & {
        visibility: visible;
    }
}
.price {
    line-height: 1.3;
    font-size: small;
    position: absolute;
    bottom: 0;
    z-index: 1001;
    width: 100%;
    visibility: hidden;
    background-color:rgba(255, 255, 255, 0.7);
    overflow-x: hidden;
    overflow-y: hidden;
    @extend %unselectable;
    background-color: #666;
    :hover > & {
        visibility: visible;
    }
}
.ks {
    bottom: 2px;
    left: 2px;
    position: absolute;
    z-index: 2;
    color: $dark;
}
.intent-symbol {
    top: 2px;
    left: 2px;
    position: absolute;
    z-index: 2;
    color: $dark;
    @extend %unselectable;
}
</style>
