const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./src/database/database.db");

db.serialize(() => {
  // cria tabela de pontos de coleta
  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      image TEXT,
      address TEXT,
      address2 TEXT,
      state TEXT,
      city TEXT,
      items TEXT
    );
  `);
  
  // cria a tabela de casas
  db.run(`
    CREATE TABLE IF NOT EXISTS houses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      address TEXT,
      address2 TEXT,
      state TEXT,
      city TEXT
    );
  `);
})

module.exports = db;