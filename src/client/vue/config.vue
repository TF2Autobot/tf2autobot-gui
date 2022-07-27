<template>
    <div class="container">
        <form method="post" target="/config">
            <h1>Config</h1>
            <div v-for="(value, key) of options"
                 :key="key">
                <recursive-option :for="key" :level="2" :data="value" :parent="key"></recursive-option>
            </div>
            <div class="text-center">
                <input type="submit" value="Save Changes">
            </div>
        </form>
    </div>
</template>

<style>

</style>

<script lang="ts">
import recursiveOption from './components/recursiveOption.vue';
export default {
    name: "config.vue",
    components: {
        recursiveOption
    },
    data(){
        return{
            options: {}
        };
    },
    methods: {
        getJson(){
            fetch('/config/options')
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    this.options = data;

                })
                .catch((error) => {
                    console.error('Error: ', error);
                });
        }/*,
        save(){
            fetch('/config', {
                method:'post',
                body: JSON.stringify(this.options),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }*/
    },

    mounted(){
        this.getJson();
    },
};
</script>


<style scoped lang="scss">
    input[type=submit] {
        position: fixed;
        bottom: 10px;
    }
</style>
