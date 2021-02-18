import express from 'express';
import path from 'path';
const app = express();
const port = 3000;
import Twig from 'twig'
console.log();
Twig.extendFunction('load_entry_tags', function (entrypoint, type){
    let entrypoints = require(path.join(require(path.join(process.cwd(), 'webpack.config.js')).output.path, './entrypoints.json')).entrypoints
    if(!entrypoints[entrypoint]) return'';
    return entrypoints[entrypoint][type].map((e)=>{
            return type == 'js' ? `<script src="${e}" defer></script>` : `<link rel="stylesheet" href="${e}">`
        })
        .reduce((buffer, e)=>{
            return buffer + e;
        }, '');
})

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
app.set('views', './src/client/views')
    .set('view engine', 'twig')
    .engine('html', Twig.__express)
    .use(express.static('./public'));
