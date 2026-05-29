const dbPromise = require('../database');

async function listarQuartos(req, res) {
    try {
        const db = await dbPromise;
        const quartos = await db.all(`SELECT * FROM quartos`);
        return res.json(quartos);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar quartos." });
    }
}

async function criarReserva(req, res) {
    const { quarto_id, data_entrada, data_saida } = req.body;
    
    const usuario_id = req.usuarioLogado.id; 

    if (!quarto_id || !data_entrada || !data_saida) {
        return res.status(400).json({ error: "Quarto e datas de entrada/saída são obrigatórios." });
    }

    try {
        const db = await dbPromise;

        const conflito = await db.get(
            `SELECT * FROM reservas 
             WHERE quarto_id = ? 
             AND ((data_entrada BETWEEN ? AND ?) OR (data_saida BETWEEN ? AND ?))`,
            [quarto_id, data_entrada, data_saida, data_entrada, data_saida]
        );

        if (conflito) {
            return res.status(400).json({ error: "Este quarto já está reservado para o período selecionado." });
        }

        await db.run(
            `INSERT INTO reservas (usuario_id, quarto_id, data_entrada, data_saida) VALUES (?, ?, ?, ?)`,
            [usuario_id, quarto_id, data_entrada, data_saida]
        );

        return res.status(201).json({ message: "Reserva realizada com sucesso!" });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao processar a reserva." });
    }
}

module.exports = { listarQuartos, criarReserva };