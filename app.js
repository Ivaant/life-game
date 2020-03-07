import { Game } from "./model.js";
import { Controller } from "./controller.js";
import { View } from "./view.js";


//**************************PROGRAM********************** */
const game = new Game(15, 15);

const controller = new Controller(game);

const view = new View(game, controller);
view.update();