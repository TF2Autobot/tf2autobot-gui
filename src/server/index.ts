import express from 'express';
import path from 'path';
const app = express();
const port = 3000;

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
