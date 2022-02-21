"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.first = void 0;
var express_1 = require("express");
var firstController_1 = require("../controllers/firstController");
var first = (0, express_1.Router)();
exports.first = first;
first.get('/', firstController_1.firstController.home);
