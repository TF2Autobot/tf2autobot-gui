const express = require('express');
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
    .set('view engine', 'ejs')
    .use(express.static('./public'));
