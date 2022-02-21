"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstController = void 0;
var FirstController = /** @class */ (function () {
    function FirstController() {
    }
    FirstController.prototype.home = function (req, res) {
        return res.json({
            message: "Hello world",
        });
    };
    return FirstController;
}());
exports.firstController = new FirstController();
