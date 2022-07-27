import passport from "passport";
import StrategyPassport from 'passport-steam';
import { Express } from "express";
import BotConnectionManager from "../IPC";

function filterBots(bot){
    return bot.admins.includes(this.user.id)||bot.id===this.user.id||['76561198086791620','76561198162885342'].includes(this.user.id)
}

export =  function init(app: Express, botManager: BotConnectionManager): void {
    let port = process.env.PORT ? process.env.SSL === 'true' ? process.env.PORT_HTTPS : process.env.PORT : 3000;
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
    const portString = process.env.SSL === 'true' ?
        port == 443 ? '' : `:${port}`
        :
        port == 80 ? '' : `:${port}`
    const address = `http${process.env.SSL=='true'?'s':''}://${process.env.VPS == 'true' ? ip : '127.0.0.1'}${portString}`;
    passport.use(new SteamStrategy(
        {
            returnURL: `${address}/auth/steam/return`,
            realm: `${address}/`,
            apiKey: process.env.API_KEY
        },
        function(identifier, profile, done) {
            // Always return profile, dont want constant logins if not an admin
            profile.identifier = identifier;
            return done(null, profile);
        }));

    app.use(passport.initialize())
        .use(passport.session())
        .use((req, res, next) => {
            if (req.originalUrl.startsWith('/auth/steam')) { // Trying to log in, continue
                return next();
            }
            if (req.user) { // Is logged in
                let bots = Object.values(botManager.bots)
                    .filter(filterBots.bind(req))
                    .map(bot => bot.id);
                if(bots.length === 0) {
                    res.render('noBots');
                    return;
                }
                if(req.originalUrl.startsWith('/pickbot')) {
                    return next();
                }
                if(!req.session.bot) {
                    if(bots.length == 1) {
                        req.session.bot = bots[0];
                        return next();
                    } else {
                        return res.render('pickBot', {
                            bots: bots
                        });
                    }
                }
                if (req.session.bot && (filterBots.bind(req) )(botManager.bots[req.session.bot])) { // Is an admin or bot, continue
                    return next();
                } else if (bots.length > 0) { // we are trying to control different bot, but we have bots avaliable
                    return res.render('pickBot', {
                        bots: bots
                    });
                }
                res.status(401);
                return res.render('no', { user: req.user });
            }
            res.redirect('/auth/steam');
        })
        .get('/pickbot', (req, res) => {
            res.render('pickBot', {
                bots: Object.values(botManager.bots)
                    .filter(filterBots.bind(req))
                    .map(bot => bot.id)
            });
        })
        .post('/pickbot', (req,res) => {
            req.session.bot = req.body.bot;
            res.redirect(301, '/');
        })
}
