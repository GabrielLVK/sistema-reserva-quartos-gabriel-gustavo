const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

async function iniciarBanco() {
    const db = await open({
        filename: path.join(__dirname, '..', 'database.db'),
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            eh_admin INTEGER DEFAULT 0
        )
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS quartos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero TEXT UNIQUE NOT NULL,
            tipo TEXT NOT NULL,
            preco REAL NOT NULL,
            descricao TEXT
        )
    `);

    console.log("Banco de dados e tabelas inicializados com sucesso!");
    return db;
}

const dbPromise = iniciarBanco();
module.exports = dbPromise;