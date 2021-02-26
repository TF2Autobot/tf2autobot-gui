import {Express} from "express";
import Twig from 'twig';
import path from 'path';

export = function init(app: Express): void {
    Twig.extendFunction('load_entry_tags', function (entrypoint, type){
        let entrypoints = require(path.join(require(path.join(process.cwd(), 'webpack.config.js')).output.path, './entrypoints.json')).entrypoints
        if(!entrypoints[entrypoint] || !entrypoints[entrypoint][type]) return'';
        return entrypoints[entrypoint][type].map((e)=>{
            return type == 'js' ? `<script src="${e}" defer></script>` : `<link rel="stylesheet" href="${e}">`
        })
            .reduce((buffer, e)=>{
                return buffer + e;
            }, '');
    });

    app.set('views', './src/client/views')
        .set('view engine', 'twig')
        .engine('html', Twig.__express)
}
