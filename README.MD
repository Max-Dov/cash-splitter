# Cash Splitter

Telegram bot capable of splitting bills among friends based on everyone participation amount.

## Configuration

Following can be configured via config files under `/config` folder:

* Features: most bot features can be switched to enabled or disabled state. By default, all features are enabled.
* Translations: anything bot says can be changed via `localization.json` file.

## Use cases

## Technologies

### Core

* [Node.js](https://nodejs.org/en/) - runtime environment
* [TypeScript](https://www.typescriptlang.org/) - programming language
* [grammY](https://grammy.dev) - Telegram bot API framework
* [fs-extra](https://www.npmjs.com/package/fs-extra) - file system managing lib

### Project Assembly
* [npm](https://www.npmjs.com)
* [webpack](https://webpack.js.org/)
* [Babel](https://babeljs.io/)

## Local Set Up
1. Git clone that repo.
2. Run `npm i` inside root directory to install npm dependencies.
3. Create bot via [BotFather](https://telegram.me/botfather) and paste your API token to `.env` file in root directory.
4. Run `npm restart` inside root directory to build sources & start bot.

## License
[AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html)