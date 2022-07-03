<template>
    <div>
        <h1> config </h1>
        <ul>
            <li>
                <tree-browser :node="data" />
            </li>
        </ul>
      </div>
</template>

<style>

</style>

<script lang="ts">
    import treeBrowser from "./components/treeBrowser.vue";
    export default {
        name: "config.vue",
        data(){
            return{
                data: {},
                index: 0,
            };
        },
        components:{
            treeBrowser
        },
        methods: {
                getJson(){
                    fetch('https://vue-http-demo-2070c-default-rtdb.europe-west1.firebasedatabase.app/options.json')
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            this.data = data;
                            this.flatJson(data);
                        })
                        .catch((error) => {
                            console.error('Error: ', error);
                        });
                },
                flatJson(entry:object){
                    for(const [key, item] of Object.entries(entry)){
                        this.index ++;
                        if(typeof item  === 'object'){
                            console.log(key);
                            this.flatJson(item);    
                        } else {
                            console.log(this.index + ' : ' + key+' : '+ item);
                        }    
                    }
                    
                }

        },
        mounted(){
            this.getJson();

        },
    };
</script>

<style scoped>
    

</style>