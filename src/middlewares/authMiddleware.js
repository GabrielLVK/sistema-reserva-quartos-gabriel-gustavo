const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../controllers/authController');

function verificarToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];

    if (!tokenHeader) {
        return res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    }

    const token = tokenHeader.split(' ')[1] || tokenHeader;

    try {
        const decorado = jwt.verify(token, JWT_SECRET);
        req.usuarioLogado = decorado; 
        next(); 
    } catch (error) {
        return res.status(400).json({ error: "Token inválido ou expirado." });
    }
}

module.exports = verificarToken;