const insultStore = require('./insults.json');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('insults');

function closeDb() {
  console.log('closeDb');
  db.close();
}

function readAllRows() {
  console.log('readAllRows insults');
  db.all('SELECT rowid AS id, insult, used FROM insults', (err, rows) => {
    rows.forEach((row) => {
      console.log(`${row.id}: ${row.insult} used: ${row.used}`);
    });
    closeDb();
  });
}

function insertRows() {
  console.log('check if insult table is populated already');

  db.get('SELECT count(*) as total FROM insults', (err, result) => {
    if (result.total && result.total > 0) {
      console.log('insult table already populated: ', result);
    } else {
      console.log('insertRows to insult db');
      const stmt = db.prepare('INSERT INTO insults VALUES (?, ?)');

      for (let i = 0; i < insultStore.insults.length; i += 1) {
        stmt.run(insultStore.insults[i], 0);
      }

      stmt.finalize(readAllRows);
    }
  });
}

function createTable() {
  console.log('createTable insult');
  db.run('CREATE TABLE IF NOT EXISTS insults (insult TEXT, used INT)', insertRows);
}

function runInsultsInit() {
  createTable();
}

runInsultsInit();
