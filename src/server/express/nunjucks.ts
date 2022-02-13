import {Express} from "express";
import nunjucks from 'nunjucks';
import path from 'path';
import fs from "fs-extra";

export = function init(app: Express): void {
    let env = nunjucks.configure('src/client/views', {
        express: app,
        watch: process.env.NODE_ENV !== "production"
    });
    env
        .addGlobal('load_entry_tags', function (entrypoint, type) {
            const webpack = require(path.join(process.cwd(), 'webpack.config.js'))
            let entrypoints = fs.readJsonSync(path.join(webpack.output.path, './manifest.json'));
            if (!entrypoints[entrypoint]) return '';
            return entrypoints[entrypoint]
                .filter(e => {
                    return e.endsWith(type);
                })
                .map((e) => path.join(webpack.output.publicPath, e))
                .map((e) => {
                    return type == 'js' ? `<script src="${e}" defer></script>` : `<link rel="stylesheet" href="${e}">`
                })
                .reduce((buffer, e) => {
                    return buffer + e;
                }, '');
        });
    app.set('view engine', 'njk')
/*
    app.set('views', './src/client/views')
        .set('view engine', 'twig')*/
    //.engine('html', Twig.__express)
}
