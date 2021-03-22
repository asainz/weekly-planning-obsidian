"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const OBSIDIAN_VAULT_PATH = "/Users/andres/Documents/obsidian-vault/";
const MILISECONDS_IN_A_DAY = 86400000;
function addNumberOfDaysToDate(date, numberOfDays = 1) {
    return new Date(Math.abs(date.getTime() + numberOfDays * MILISECONDS_IN_A_DAY));
}
function getNumberOfWeek(date) {
    date = date || new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
function getDatesofCurrentWeek() {
    const today = new Date();
    const milisecondsInDay = 86400000;
    const startOfWeek = new Date(Math.abs(today.getTime() - today.getDay() * MILISECONDS_IN_A_DAY));
    return [
        startOfWeek,
        addNumberOfDaysToDate(startOfWeek, 1),
        addNumberOfDaysToDate(startOfWeek, 2),
        addNumberOfDaysToDate(startOfWeek, 3),
        addNumberOfDaysToDate(startOfWeek, 4),
        addNumberOfDaysToDate(startOfWeek, 5),
        addNumberOfDaysToDate(startOfWeek, 6),
    ];
}
function extractUncheckedTodos(filepath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = yield fs_1.promises.readFile(filepath, "utf8");
        const lines = fileContent
            .split("\n")
            .filter((line) => !!line.match(/^\s*- \[ \].*$/));
        return lines.map((line) => ({ content: line }));
    });
}
function getTodosForEntireWeek() {
    return __awaiter(this, void 0, void 0, function* () {
        const daysOfWeek = getDatesofCurrentWeek();
        const todosPerDay = [];
        for (let i = 0; i < daysOfWeek.length; i++) {
            const date = daysOfWeek[i];
            const dayNumber = ("0" + (date.getDate() + 1)).slice(-2);
            const monthNumber = ("0" + (date.getMonth() + 1)).slice(-2);
            const res = yield extractUncheckedTodos(`${OBSIDIAN_VAULT_PATH}${dayNumber}.${monthNumber}.${date.getFullYear()}.md`);
            todosPerDay.push({
                date: date.toString(),
                todos: res,
            });
        }
        return todosPerDay;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const todos = yield getTodosForEntireWeek();
        console.log(todos);
        const weekFilePath = `${OBSIDIAN_VAULT_PATH}${new Date().getFullYear()}-W${getNumberOfWeek() + 1}.md`;
        const save = yield fs_1.promises.writeFile(weekFilePath, JSON.stringify(todos, null, "\t"));
    });
}
main();
//# sourceMappingURL=index.js.map