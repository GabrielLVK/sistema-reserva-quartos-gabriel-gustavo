const express = require('express');
const router = express.Router();
const path = require('path');
const repo = require('../repositories/hotelRepository');
const service = require('../services/hotelService');

function authMiddleware(req, res, next) {
    if (!req.session || !req.session.usuario) return res.redirect('/erro');
    next();
}

function adminMiddleware(req, res, next) {
    if (!req.session || !req.session.usuario || req.session.usuario.role !== 'admin') {
        return res.redirect('/erro');
    }
    next();
}

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'home.html')));
router.get('/cadastro', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'cadastro.html')));
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'login.html')));
router.get('/catalogo', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html')));
router.get('/reservas/nova', authMiddleware, (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'nova-reserva.html')));
router.get('/erro', (req, res) => res.sendFile(path.join(__dirname, '..', 'views', 'erro.html')));

router.get('/minhas-reservas', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'minhas-reservas.html'));
});

router.get('/admin/reservas', authMiddleware, adminMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin-reservas.html'));
});

router.get('/admin/quartos/novo', authMiddleware, adminMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'admin.html'));
});

router.get('/api/quartos', (req, res) => res.json(repo.listarTodosQuartos()));

router.post('/login', (req, res) => {
    try {
        const { email, senha } = req.body;
        if (email === "admin@ecostay.com" && senha === "admin123") {
            req.session.usuario = { id: 99, nome: "Admin", role: "admin" };
            return res.redirect('/admin/reservas'); // Admin entra direto na listagem de reservas criadas
        }
        req.session.usuario = service.autenticar(email, senha);
        res.redirect('/catalogo');
    } catch (err) { res.send(`<h3>${err.message}</h3><a href="/login">Voltar</a>`); }
});

router.post('/cadastro', (req, res) => {
    try {
        service.cadastrarHospede(req.body.nome, req.body.email, req.body.senha);
        res.redirect('/login');
    } catch (err) { res.send(`<h3>${err.message}</h3><a href="/cadastro">Voltar</a>`); }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/reservas-dados', (req, res) => {
    if (!req.session || !req.session.usuario) return res.status(403).json({ error: "Não autorizado" });
    const minhasReservas = repo.listarReservasPorUsuario(req.session.usuario.id);
    res.json({ usuario: req.session.usuario, reservas: minhasReservas });
});

router.get('/admin/api/reservas', authMiddleware, adminMiddleware, (req, res) => {
    const listaRaw = repo.listarTodasReservasGerais();
    
    const listaCompleta = listaRaw.map(r => {
        const cliente = repo.buscarUsuarioPorId(r.usuario_id);
        return {
            ...r,
            nomeUsuario: cliente ? cliente.nome : "Usuário Admin"
        };
    });
    res.json(listaCompleta);
});

router.post('/reservas', authMiddleware, (req, res) => {
    try {
        service.criarReserva(req.session.usuario.id, req.body.quarto_id, req.body.data_entrada, req.body.data_saida);
        res.redirect('/minhas-reservas'); // Redireciona direto para a página separada de reservas!
    } catch (err) { res.send(`<h3>Erro: ${err.message}</h3><a href="/catalogo">Voltar</a>`); }
});

router.post('/reservas/:id/cancelar', authMiddleware, (req, res) => {
    repo.cancelarReserva(req.params.id);
    res.redirect('/minhas-reservas');
});

router.post('/admin/quartos', authMiddleware, adminMiddleware, (req, res) => {
    repo.salvarQuarto({ numero: req.body.numero, tipo: req.body.tipo, preco: parseFloat(req.body.preco), descricao: req.body.descricao });
    res.redirect('/admin/reservas');
});

module.exports = router;