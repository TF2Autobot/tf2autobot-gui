import passport from "passport";
import StrategyPassport from 'passport-steam';
import { Express } from "express";
import BotConnectionManager from "../IPC";

export =  function init(app: Express, botManager: BotConnectionManager): void {
    let port = process.env.PORT ? process.env.PORT : 3000;
    let ip = process.env.ADDRESS;

    if (isNaN(+port)) {
        port = 3000;
    }

    const SteamStrategy = StrategyPassport.Strategy

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });
    passport.use(new SteamStrategy({
            returnURL: process.env.VPS == 'true' ? `http://${ip}:${port}/auth/steam/return` : `http://127.0.0.1:${port}/auth/steam/return`,
            realm: process.env.VPS == 'true' ? `http://${ip}:${port}/` : `http://127.0.0.1:${port}/`,
            apiKey: process.env.API_KEY
        },
        function(identifier, profile, done) {
            // Always return profile, dont want constant logins if not an admin
            profile.identifier = identifier;
            return done(null, profile);
        }
    ));

    app.use(passport.initialize())
        .use(passport.session())
        .use((req, res, next) => {
            if (req.originalUrl.startsWith('/auth/steam')) { // Trying to log in, continue
                return next();
            }
            if (req.user) { // Is logged in
                if (req.session.bot && botManager.bots[req.session.bot]?.admins?.includes(req.user.id)) { // Is an admin, continue TODO: remove true
                    return next();
                }
                res.status(401);
                return res.render('no', { user: req.user });
            }
            res.redirect('/auth/steam');
        })
        .get('/pickbot', (req, res)=>{
            res.render('pickBot', {
                bots: Object.values(botManager.bots)
                    .filter(bot => bot.admins.includes(req.user.id))
                    .map(bot => bot.id)
            });
        })
        .post('/pickbot', (req,res)=>{
            req.session.bot = req.body.bot;
            res.redirect(301, '/');
        })
        .use((req, res, next) => {
            let bots = Object.values(botManager.bots)
                .filter(bot => bot.admins.includes(req.user.id)||bot.id===req.user.id)
                .map(bot => bot.id);
            if(bots.length === 0) {
                res.render('noBots');
            }
            if(req.user && !req.session.bot) {
                if(bots.length == 1) {
                    req.session.bot = bots[0];
                    next();
                } else {
                    res.render('pickBot', {
                        bots: bots
                    });
                }
            } else {
                next()
            }
        })

}
