const express = require('express');
const router = express.Router();
const repo = require('../repositories/hotelRepository');
const service = require('../services/hotelService');

function authMiddleware(req, res, next) {
    if (!req.session || !req.session.usuario) return res.redirect('/login');
    next();
}

function adminMiddleware(req, res, next) {
    if (!req.session || !req.session.usuario || req.session.usuario.role !== 'admin') {
        return res.redirect('/erro');
    }
    next();
}

router.get('/', (req, res) => res.send('<h1>EcoStay Home</h1><p>Bem-vindo ao hotel!</p><a href="/quartos">Ver Quartos</a> | <a href="/login">Login</a>'));
router.get('/quartos', (req, res) => res.json(repo.listarTodosQuartos()));
router.get('/login', (req, res) => res.send('<h2>Login</h2><form method="POST" action="/login"><input type="email" name="email" placeholder="Email"><input type="password" name="senha" placeholder="Senha"><button type="submit">Entrar</button></form>'));

router.post('/login', (req, res) => {
    try {
        if(req.body.email === "admin@ecostay.com" && req.body.senha === "admin123") {
            req.session.usuario = { id: 99, nome: "Admin", role: "admin" };
            return res.send("Logado como Admin! Vá para /admin/quartos/novo");
        }
        const usuario = service.autenticar(req.body.email, req.body.senha);
        req.session.usuario = usuario;
        res.redirect('/reservas');
    } catch (err) { res.send(err.message); }
});

router.get('/cadastro', (req, res) => res.send('<h2>Cadastro</h2><form method="POST" action="/cadastro"><input type="text" name="nome" placeholder="Nome"><input type="email" name="email" placeholder="Email"><input type="password" name="senha" placeholder="Senha"><button type="submit">Cadastrar</button></form>'));
router.post('/cadastro', (req, res) => {
    try {
        service.cadastrarHospede(req.body.nome, req.body.email, req.body.senha);
        res.redirect('/login');
    } catch (err) { res.send(err.message); }
});

router.get('/reservas', authMiddleware, (req, res) => {
    const minhasReservas = repo.listarReservasPorUsuario(req.session.usuario.id);
    res.json({ usuario: req.session.usuario, reservas: minhasReservas });
});
router.post('/reservas', authMiddleware, (req, res) => {
    try {
        service.criarReserva(req.session.usuario.id, req.body.quarto_id, req.body.data_entrada, req.body.data_saida);
        res.redirect('/reservas');
    } catch (err) { res.send(err.message); }
});
router.post('/reservas/:id/cancelar', authMiddleware, (req, res) => {
    repo.cancelarReserva(req.params.id);
    res.redirect('/reservas');
});
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/admin/quartos/novo', authMiddleware, adminMiddleware, (req, res) => {
    res.send('<h2>Admin - Novo Quarto</h2><form method="POST" action="/admin/quartos"><input type="text" name="numero" placeholder="Num"><input type="text" name="tipo" placeholder="Tipo"><input type="number" name="preco" placeholder="Preço"><button type="submit">Salvar</button></form>');
});
router.post('/admin/quartos', authMiddleware, adminMiddleware, (req, res) => {
    repo.salvarQuarto(req.body);
    res.send("Quarto criado! Verifique em /quartos");
});
router.post('/admin/quartos/:id/editar', authMiddleware, adminMiddleware, (req, res) => {
    repo.atualizarQuarto(req.params.id, req.body);
    res.send("Quarto atualizado!");
});
router.post('/admin/quartos/:id/deletar', authMiddleware, adminMiddleware, (req, res) => {
    repo.deletarQuarto(req.params.id);
    res.send("Quarto deletado!");
});
router.get('/erro', (req, res) => res.send("<h1>Acesso Negado / Não Autorizado</h1>"));

module.exports = router;