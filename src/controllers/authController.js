const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbPromise = require('../database');

const JWT_SECRET = 'ecostay_secret_key';

async function cadastrar(req, res) {
    const { nome, email, senha, eh_admin } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).json({ error: "Por favor, preencha todos os campos obrigatórios." });
    }
    try {
        const db = await dbPromise;
        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        await db.run(
            `INSERT INTO usuarios (nome, email, senha, eh_admin) VALUES (?, ?, ?, ?)`,
            [nome, email, senhaCriptografada, eh_admin || 0]
        );
        return res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "Este e-mail já está cadastrado." });
        }
        return res.status(500).json({ error: "Erro interno ao cadastrar usuário." });
    }
}

async function login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }
    try {
        const db = await dbPromise;
        const usuario = await db.get(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        
        if (!usuario) {
            return res.status(400).json({ error: "E-mail ou senha incorretos." });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ error: "E-mail ou senha incorretos." });
        }

        const token = jwt.sign(
            { id: usuario.id, eh_admin: usuario.eh_admin },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.json({ message: "Login realizado com sucesso!", token });
    } catch (error) {
        return res.status(500).json({ error: "Erro interno ao realizar login." });
    }
}

module.exports = { cadastrar, login, JWT_SECRET };