import * as Rx from 'rxjs/Rx';
import faker from 'faker';
import { setTimeout } from 'timers';

const FILE_TYPES = [
	'.xlsx', '.xlsm', '.xlsb', '.xltm', '.xls', // excel
	'.pdf',
	'.mp3', '.aac', '.wav',// sound
	'.doc', '.docx', // word
	'.zip', '.7zip', '.rar', // archive,
	'.jpg', '.png', '.bmp', // image
	'.txt', '.csv', // text
	'.bin', '.dll', '.3ds', '.lls', // unknown format
	'.mp4', '.avi', // video
	'.js', '.ts', '.cs', '.css', '.html', '.java', '.c', '.h', // code
	'.ppt', // powerpoint 
];

const array = (N: number) =>  [...Array(N).keys()];

const PROJECT_COUNT = 10;
const USERS_COUNT = 10;
const STARTING_GENERATION_COUNT = 100;
const EVENTS_PER_TICK = 5;

interface SortableByDate {
	date: Date,
}

interface Project {
	id: number,
	title: string,
}

interface User {
	id: number,
	name: string,
	avatar: string,
}

interface Activity {
	type: 'comment' | 'file',
}

interface File extends SortableByDate, Activity {
	projectId: number,
	name: string,
	id: number,
	userId: number,
}

interface Comment extends SortableByDate, Activity {
	id: number,
	text: string,
	fileId: number,
	userId: number,
	projectId: number,
}

function isUser(x: any): x is User {
	return x.avatar !== undefined;
}

function isFile(x: any): x is File {
	return x.type === 'file';
}

const Projects: Project[] = array(PROJECT_COUNT).map(i => ({id: i, title: faker.company.companyName()}));
const Users: User[] = array(USERS_COUNT).map(i => ({id: i, name: faker.internet.userName(), avatar: faker.image.avatar()}));

const files$ = new Rx.Subject<File>();
const comments$ = new Rx.Subject<Comment>();

const Files = [];
const Comments = [];

files$.subscribe(v => Files.push(v));
comments$.subscribe(v => Comments.push(v));

function generateFile(time): File {
	return {
		id: Files.length,
		projectId: faker.random.arrayElement(Projects).id,
		name: faker.internet.domainName() + faker.random.arrayElement(FILE_TYPES),
		userId: faker.random.arrayElement(Users).id,
		date: time,
		type: 'file',
	}
}

function generateComment(time): Comment {
	const file = faker.random.arrayElement(Files);
 	return {
		id: Comments.length,
		text: faker.lorem.paragraph(),
		userId: faker.random.arrayElement(Users).id,
		fileId: file.id,
		projectId: file.projectId,
		date: time,
		type: 'comment',
	}
}

function commitFile(time) {
	//const currentFilesList = Files.getValue();
	files$.next(generateFile(time));
}

function commitComment(time) {
	comments$.next(generateComment(time));
}

const commiters = [commitComment, commitFile];

function generation(now?: boolean) {
	faker.random.arrayElement(commiters)(now ? new Date() : faker.date.past());
}

commitFile(faker.date.past());
array(STARTING_GENERATION_COUNT).forEach(_ => generation(false));

function getActivities(f?: File | Project | User) {
	const currentFiles = [...Files];
	const currentComments = [...Comments];
	if (f === undefined) {
		return [...currentFiles, ...currentComments];
	}
	if (isUser(f)) {
		const userId = f.id;
		return [
			...currentFiles.filter(file => file.userId === userId),
			...currentComments.filter(comment => comment.userId === userId),
		]
	}
	
	if (isFile(f)) {
		const fileId = f.id;
		return currentComments.filter(comment => comment.fileId === fileId);
	}

	const projectId = f.id;
	return [
			...currentFiles.filter(file => file.projectId === projectId),
			...currentComments.filter(comment => comment.projectId === projectId),
		]
}

function filterByDate(collection: SortableByDate[], date?: Date) {
	const sorted = collection.sort((a, b) => +b.date - +a.date);
	if (date) {
		const index = sorted.findIndex(v => v.date < date);
		if (index < 0) {
			return [];
		} else {
			return sorted.slice(index, Math.min(index + 10, sorted.length - 1));
		}
	}

	return sorted.slice(0, 10);
}

const filterFabric = (f?: File | Project | User) => {
	if (f === undefined) {
		return _ => true;
	}

	if (isFile(f)) {
		return (v: File | Comment) => isFile(v) ? false : v.fileId === f.id;
	}

	if (isUser(f)) {
		return (v: File | Comment) => v.userId === f.id;
	}

	return (v: File | Comment) => v.projectId === f.id;
}

const timelineFabric = (f?: File | Project | User) => {
	return {
		entity() {
			return new Promise(res => {
				setTimeout(_ => res(f), 100 + faker.random.number(1000))
			});
		},
		getActivities(before?: Date) {
			return new Promise((res, rej) => {
				setTimeout(() => {
					res(filterByDate(getActivities(f), before))
				}, 100 + faker.random.number(1000))
			});
		},
		subscribe(cb:(v: File | Comment) => void) {
			const filter = filterFabric(f);
			return Rx.Observable.merge(
				files$.filter(filter),
				comments$.filter(filter)
			).subscribe(cb);
		}
	}
}

export const timeline = timelineFabric();

export const project = (projectId: number) => {
	const pr = Projects.find(p => p.id === projectId);
	if (pr === null) {
		throw new Error(`Project with id: ${projectId} doesn't exists`);
	}

	return timelineFabric(pr);
}

export const user = (userId: number) => {
	const usr = Users.find(p => p.id === userId);
	if (usr === null) {
		throw new Error(`User with id: ${userId} doesn't exists`);
	}

	return timelineFabric(usr);
}

export const file = (fileId: number) => {
	const fl = Files.find(p => p.id === fileId);
	if (fl === null) {
		throw new Error(`File with id: ${fileId} doesn't exists`);
	}

	return timelineFabric(fl);

}

const realTimeGenerations = () => {
	array(EVENTS_PER_TICK).forEach(() => generation(true));
	setTimeout(realTimeGenerations, 2000 + faker.random.number(3000));
}

setTimeout(realTimeGenerations, 1000);