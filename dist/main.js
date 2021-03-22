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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_todos_1 = __importDefault(require("./lib/extract-todos"));
const OBSIDIAN_VAULT_PATH = "/Users/andres/Documents/obsidian-vault";
function getTodosForEntireWeek() {
    return __awaiter(this, void 0, void 0, function* () {
        const daysOfWeek = getDatesofCurrentWeek();
        const a = yield daysOfWeek.map((date) => __awaiter(this, void 0, void 0, function* () {
            const dayNumber = ("0" + (date.getDate() + 1)).slice(-2);
            const monthNumber = ("0" + (date.getMonth() + 1)).slice(-2);
            const res = yield extract_todos_1.default(`/Users/andres/Documents/obsidian-vault/${dayNumber}.${monthNumber}.${date.getFullYear()}.md`);
            return {
                date: date.toString(),
                todos: res,
            };
        }));
        return a;
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield getTodosForEntireWeek();
        console.log(data);
    });
}
exports.default = main;
function addNumberOfDaysToDate(date, numberOfDays = 1) {
    const milisecondsInDay = 86400000;
    return new Date(Math.abs(date.getTime() + numberOfDays * milisecondsInDay));
}
function getDatesofCurrentWeek() {
    const today = new Date();
    const milisecondsInDay = 86400000;
    const startOfWeek = new Date(Math.abs(today.getTime() - today.getDay() * milisecondsInDay));
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
main();
//# sourceMappingURL=main.js.map