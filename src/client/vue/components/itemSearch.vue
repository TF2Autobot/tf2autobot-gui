<template>
    <div class="position-relative">
        <label :for="id">Name</label>
        <input class="form-control" :id="id" name="name" type="search" placeholder="Item name" aria-label="Search"
               autocomplete="off"
               required v-model="name" :disabled="disable" @focus="searchFocus=true" @focusout="searchFocus=false"
               @input="searchDisable=false">
        <div class="search-dropdown"  v-if="searchFocus && !searchDisable">
            <div v-if="name===''">What item are you looking for?</div>
            <div class="search-result" v-for="item in itemSearch" :key="item.defindex" @mousedown="searchClick(item)">
                <img :src="item.image_small"
                     :style="{ backgroundColor: item.quality_color, borderStyle: item.craftable? false : 'dashed', borderColor: item.border_color}" alt="item">
                <div> {{ item.name }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "modelValue ",
    props: ['modelValue', 'id', 'disable'],
    emits: ['update:modelValue', 'item'],
    data() {
        return {
            searchFocus: false,
            searchDisable: false,
            itemSearch: false,
        }
    },
    computed: {
        name: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    },
    watch: {
        name(newName, oldName) {
            console.log('name: ' + this.name)
            this.searchDisable = false;
            if (newName.trim() !== oldName.trim() && newName.trim() !== '') {
                fetch('/search?text=' + encodeURI(newName)) // TODO: text=item
                    .then((response) => {
                        return response.json();
                    })
                    .then(data => {
                        this.itemSearch = data.results;
                    })
                    .catch(error => {
                        this.itemSearch = 'Search failed failed'
                    })
            } else if (newName.trim() === '') {
                this.itemSearch = false;
            }
        }
    },
    methods: {
        searchClick(item) {
            this.$emit('item', item);
            this.searchDisable = true;
        }
    }
}
</script>

<style scoped lang="scss">
$dark: #212529; //From bootstrap

.search-dropdown {
    top: 100%;
    width: 100%;
    z-index: 9999;
    position: absolute;
    .search-result {
        background-color: lighten($dark, 5%);
        border-left: 2px solid white;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        height: 64px;
        img {
            height: 100%;
        }
        :last-child {
            display: inline-block;
        }
    }
}
</style>
