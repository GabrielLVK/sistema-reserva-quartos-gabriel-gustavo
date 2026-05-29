const dbPromise = require('../database');

async function cadastrarQuarto(req, res) {
    const { numero, tipo, preco, descricao } = req.body;

    if (!numero || !tipo || !preco) {
        return res.status(400).json({ error: "Número, tipo e preço são obrigatórios." });
    }

    try {
        const db = await dbPromise;
        
        await db.run(
            `INSERT INTO quartos (numero, tipo, preco, descricao) VALUES (?, ?, ?, ?)`,
            [numero, tipo, preco, descricao]
        );

        return res.status(201).json({ message: "Quarto cadastrado com sucesso pelo Administrador!" });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "Já existe um quarto cadastrado com este número." });
        }
        return res.status(500).json({ error: "Erro interno ao cadastrar quarto." });
    }
}

module.exports = { cadastrarQuarto };