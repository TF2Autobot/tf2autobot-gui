<template>
    <component :is="`h${level}`">{{this.for}}</component>
    <div v-for="(value, key) of data"
        :key="key"
        :style="{
            'border-left': `#29a30e solid ${10-level*2}px`}">
        <component :is="isObject(value) ? 'recursive-option' : 'label'"
                   :for="key"
                   :level="level+1"
                   :data="isObject(value) ? value : undefined"
                   :parent="isObject(value) ? newParent(key) : undefined">
            {{key}}
        </component>
        <input v-if="!isObject(value)" :id="newParent(key)" :name="newParent(key)" :type="getType(value)" value="{{getType(value) === 'checkbox' ? 'true' : vals[key] = value}}" :checked="getType(value) === 'checkbox' ? value : false" v-model="vals[key]">
        <input type='hidden' v-if="
            !isObject(value) &&
            getType(value) === 'checkbox' &&
            (
                vals[key]==false ||
                (
                    typeof vals[key] === 'undefined' &&
                    value==false
                )
            )" :name="newParent(key)" value="false">
    </div>
</template>

<script>
export default {
    name: 'recursive-option',
    props: ['for', 'level', 'data', 'parent'],
    data: function () {
        return {
            vals: this.data,
            console
        }
    },
    methods: {
        getType(value) {
            switch (typeof value) {
                case 'boolean':
                    return 'checkbox';
                case 'number':
                    return 'number';
                case 'string':
                    return 'text';
                case 'object'://
                    if(Array.isArray(value)) return 'button';
                default:
                    return 'button';
            }
        },
        isObject(value) {
            return typeof value === 'object' && !Array.isArray(value);
        },
        newParent(key){
            return this.parent ? `${this.parent}$${key}` : key;
        }
    }
};
</script>

<style scoped lang="scss">
div {
    margin-left: 2rem;
    padding-left: 5px;
    input {
        position: absolute;
        right: 0px;
    }
    position: relative;
    padding-bottom: 5px;
}
</style>
