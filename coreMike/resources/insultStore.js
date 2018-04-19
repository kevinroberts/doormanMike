var insultStore = require('./insults.json');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('insults');


function createTable() {
  console.log("createTable insult");
  db.run("CREATE TABLE IF NOT EXISTS insults (insult TEXT, used INT)", insertRows);
}

function insertRows() {

  console.log("check if insult table is populated already");

  db.get("SELECT count(*) as total FROM insults", function (err, result) {
    if (result.total && result.total > 0) {
      console.log("insult table already populated: ", result);
    } else {
      console.log("insertRows insult i");
      var stmt = db.prepare("INSERT INTO insults VALUES (?, ?)");

      for (var i = 0; i < insultStore.insults.length; i++) {
        stmt.run(insultStore.insults[i], 1);
      }

      stmt.finalize(readAllRows);
    }
  });
}

function readAllRows() {
  console.log("readAllRows insults");
  db.all("SELECT rowid AS id, insult, used FROM insults", function(err, rows) {
    rows.forEach(function (row) {
      console.log(row.id + ": " + row.insult + " used: " + row.used);
    });
    closeDb();
  });
}

function closeDb() {
  console.log("closeDb");
  db.close();
}

function runInsultsInit() {
  createTable();
}

runInsultsInit();
