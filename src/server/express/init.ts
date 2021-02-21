import express, {Express} from 'express';

import initBody from './body';
import initPassport from './passport';
import initTwig from './twig';
import initRoutes from './routes';

export = function init(app: Express): void {
    app.use(express.static('./public'))
    initBody(app);
    if(process.env.STEAM_AUTH) {
        initPassport(app);
    }
    initTwig(app);
    initRoutes(app);
}
