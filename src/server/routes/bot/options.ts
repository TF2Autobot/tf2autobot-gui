import express, { Router } from 'express';
import BotConnectionManager from "../../IPC";
import pricelist from './pricelist';

const getOptions = function(botManager : BotConnectionManager) {
    const router = express.Router()
    
    router.get('/options', async (req, res) => {
        let options
        try {
            options = await botManager.getBotOptions(req.session.bot)
        }catch(e){
            res.status(400)
            throw new Error('Options not found. If the bot *does* have an options.json file, open an issue on GitHub.')
        }
        options = Object.values(options)
        res.json(pricelist)
    })
    return router
}

module.exports = {
    getOptions
}