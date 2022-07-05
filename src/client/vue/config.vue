<template>
    <div>
        <h1> config </h1>
        <ul v-for="item in items"
            :key = item
            :style="{'margin-left': `${depth * 20}px`}">
            <li>
                {{item}}
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
                index: 0,
                typ: "",
                items: [{}],
                depth: 0,
            };
        },
        components:{
            treeBrowser
        },
        methods: {
                getJson(){
                    fetch('https://adams-demo-default-rtdb.europe-west1.firebasedatabase.app/options.json')
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            this.flatJson(data, '');
                            this.runThruData(data);
                        })
                        .catch((error) => {
                            console.error('Error: ', error);
                        });
                },
                flatJson(entry:object, parrent:string){  
                    for(const [key, item] of Object.entries(entry)){
                        this.index ++;
                        if(typeof item  === 'object'){
                            this.flatJson(item, key);  
                        } else {
                            // if(typeof item === 'number'){
                            //     this.typ = "cislo";
                            // } else if (typeof item === 'string'){
                            //     this.typ = "text"
                            // }
                            
                            this.items.push(parrent); 
                            console.log(parrent + ' ' + this.index + ' : ' + key+' : '+ item + ' : ' + this.typ);
                        }     
                    }
                },
                runThruData(jsonObject:object){
                    for(const [key, item] of Object.entries(jsonObject)){
                        if (typeof item === 'object'){
                            console.log(this.depth+ ':'+key);
                            this.depth++;
                            this.runThruData(item);
                        } else {
                            console.log(this.depth+ ':->' +key+' : '+item)
                        }
                    }
                this.depth--; 
                },
        },
        mounted(){
            this.getJson();
        },
    };
</script>

<style scoped>
    

</style>