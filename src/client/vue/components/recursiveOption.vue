<template>
    <component :is="`h${level}`">{{this.for}}</component>
    <div v-for="(value, key) of data"
        key="key"
        :style="{
            'border-left': `#29a30e solid ${10-level*2}px`}">
        <component :is="typeof value === 'object' ? 'recursive-option' : 'label'"
                   :for="key"
                   :level="level+1"
                   :data="typeof value === 'object' ? value : undefined"
                   :parent="typeof value === 'object' ? newParent(key) : undefined">
            {{key}}
        </component>
        <input v-if="typeof value !== 'object'" :id="newParent(key)" :name="newParent(key)" :type="getType(value)" :value="getType(value) === 'checkbox' ? 'true' : value" :checked="getType(value) === 'checkbox' ? value : false">
    </div>
</template>

<script>
export default {
    name: 'recursive-option',
    props: ['for', 'level', 'data', 'parent'],
    methods: {
        getType(value) {
            switch (typeof value) {
                case 'boolean':
                    return 'checkbox';
                case 'number':
                    return 'number';
                case 'string':
                    return 'text';
                default:
                    return 'button';
            }
        },
        newParent(key){
            return this.parent ? `${this.parent}.${key}` : key;
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
