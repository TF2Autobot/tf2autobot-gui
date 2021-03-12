# COMPILATON
before start use `sed -i '1s/^(?!\/\/ @ts-nocheck)/\/\/ @ts-nocheck\n/' node_modules/@types/webpack/index.d.ts` on linux
or if you are on windows, go to node_modules/@types/webpack/index.d.ts and add `//@ts-nocheck` on the first line

# TF2-Automatic GUI
An easy to use graphical user interface that helps you add items faster to your bot's pricelist!

# Guide
Please see the [Wiki](https://github.com/ZeusJunior/tf2-automatic-gui/wiki) for an installation / usage guide.

# Note
This project is open source and thus it takes more time to fix bugs, please be patient.

# Contributing
For contributing, please use eslint for linting, it makes code more readable and usable.
Your PR can be closed if you don't follow this rule.

#compile
1. `npm run build-front`
2. `npm run build-back`
You can add `-watch` to run watch mode

#start 
`node dist/server`
