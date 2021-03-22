import path from "path";
import { promises as fs } from "fs";

const OBSIDIAN_VAULT_PATH: string = "";
const MILISECONDS_IN_A_DAY: number = 86400000;

// Types
type TodoType = {
	content: string;
};

function addNumberOfDaysToDate(date: Date, numberOfDays: number = 1): Date {
	return new Date(
		Math.abs(date.getTime() + numberOfDays * MILISECONDS_IN_A_DAY)
	);
}

function getNumberOfWeek(date?: Date): number {
	date = date || new Date();
	const firstDayOfYear: Date = new Date(date.getFullYear(), 0, 1);
	const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
	return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getDatesofCurrentWeek(): Array<Date> {
	const today: Date = new Date();
	const milisecondsInDay: number = 86400000;

	const startOfWeek: Date = new Date(
		Math.abs(today.getTime() - today.getDay() * MILISECONDS_IN_A_DAY)
	);

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

async function extractUncheckedTodos(
	filepath: string
): Promise<Array<TodoType>> {
	const fileContent: string = await fs.readFile(filepath, "utf8");
	const lines: Array<string> = fileContent
		.split("\n")
		.filter((line) => !!line.match(/^\s*- \[ \].*$/));
	return lines.map((line) => ({ content: line }));
}

async function getTodosForEntireWeek() {
	const daysOfWeek: Array<Date> = getDatesofCurrentWeek();
	const todosPerDay = [];
	for (let i: number = 0; i < daysOfWeek.length; i++) {
		const date: Date = daysOfWeek[i];
		const dayNumber = ("0" + (date.getDate() + 1)).slice(-2);
		const monthNumber = ("0" + (date.getMonth() + 1)).slice(-2);
		const res = await extractUncheckedTodos(
			`${OBSIDIAN_VAULT_PATH}${dayNumber}.${monthNumber}.${date.getFullYear()}.md`
		);
		todosPerDay.push({
			date: date.toString(), // toLocaleDateString
			todos: res,
		});
	}

	return todosPerDay;
}

async function main(): Promise<void> {
	const todos = await getTodosForEntireWeek();

	console.log(todos);
	const weekFilePath = `${OBSIDIAN_VAULT_PATH}${new Date().getFullYear()}-W${
		getNumberOfWeek() + 1
	}.md`;

	const save = await fs.writeFile(
		weekFilePath,
		JSON.stringify(todos, null, "\t")
	);
}

main();
