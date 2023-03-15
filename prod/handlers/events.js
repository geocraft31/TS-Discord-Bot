"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var Path = require("path");
var fs = require("fs");
var eventsPath = Path.resolve(__dirname, "./../events/");
module.exports = function (bot) {
    var events = fs.readdirSync(eventsPath).filter(function (f) { return f.endsWith(".js"); });
    events.forEach(function (eventName) {
        var event = require(eventsPath + "/".concat(eventName));
        bot.events.set(event.name, event);
        console.log("Event: \u001B[33m ".concat(event.name, " \u001B[0m ~ \u001B[32m Loaded \u001B[0m"));
    });
    initEvents(bot);
};
var initEvents = function (bot) {
    var client = bot.client;
    client.on("ready", function () {
        triggerEventHandler(bot, "ready");
    });
    client.on("messageCreate", function (message) {
        triggerEventHandler(bot, "messageCreate", message);
    });
};
var triggerEventHandler = function (bot, eventName) {
    var _a;
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var events = bot.events;
    try {
        if (events.has(eventName))
            (_a = events.get(eventName)).run.apply(_a, __spreadArray([bot], args, false));
        else
            throw new Error("Event ".concat(eventName, " does not exist"));
    }
    catch (err) {
        console.error(err);
    }
};
