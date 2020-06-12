import Dexie from 'dexie';
let db;
let LatestVersion = 1;

function creatDB() {
	db = new Dexie('whaleHouse');
	db.version(1).stores({
		stock:  'projectId,' +
				'options'
	});

}

let version = localStorage.getItem('version');
if ((version && version < LatestVersion) || !version) {
	Dexie.delete('whaleHouse');
	localStorage.setItem('version', LatestVersion);
	creatDB();
} else {
	creatDB();
	localStorage.setItem('version', LatestVersion);
}
// });

export default db;
