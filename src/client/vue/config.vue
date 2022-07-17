<template>
    <div class="container">
        <h1> config </h1>

        <div v-for="item in items.slice(1)"
            :key="item.id"
            :id="item.id"
            class="row"
        >

            <h5  :style="{'margin-left': `${item.depth * 30}px`}" class="col-sm lh-lg">
                {{item.key}} <br>
            </h5>

            <h5 class="col-sm text-muted lh-lg">
                {{item.data}}
            </h5>
            
            <div class="col">
                <div v-if="item.type === 'checkbox'">
                    <input type="checkbox" v-model="item.data" />
                </div>
                
                <div v-else-if="item.type === 'number'">
                    <input type="number" v-model="item.data" />
                </div>

                <div v-else-if="item.type === 'text'">
                    <input type="text" v-model="item.data" />
                </div>
            </div>

        </div>

        <div class="position-relative">
            <div class="position-fixed bottom-30 start-90">
                <button type="button" class="btn btn-success">Send</button>
            </div>
        </div>
      </div>
</template>

<style>

</style>

<script lang="ts">
    export default {
      name: "config.vue",
        data(){
            return{
                index: 0,
                depth: 0,
                items: [{}],
            };
        },
        methods: {
                getJson(){
                    fetch('https://adams-demo-default-rtdb.europe-west1.firebasedatabase.app/options.json')
                        .then((response) => {
                            return response.json();
                        })
                        .then((data) => {
                            this.runThruData(data);
                            
                        })
                        .catch((error) => {
                            console.error('Error: ', error);
                        });
                },
                runThruData(jsonObject:object){
                    for(const [key, item] of Object.entries(jsonObject)){     
                       if (typeof item === 'object'){
                            this.items.push({
                                key: key, 
                                depth: this.depth, 
                                type: "none",
                                data: ""
                            });
                            this.depth++;
                            this.runThruData(item);
                        } else {
                            this.items.push({
                                key: key, 
                                depth: this.depth, 
                                type: this.whichType(item),
                                data: item
                        });
                        }
                    }
                    this.depth--; 
                },
                whichType(type:boolean):string{
                    if(type === false || type === true){
                        return 'checkbox';
                    }else if(typeof type === 'number'){
                        return 'number';
                    }
                    else {
                        return 'text';
                    }
                },
        },
        
        mounted(){
            this.getJson();
        },
    };
</script>   


<style scoped>
    

</style>