const express = require('express');
const app = express();
const PORT = 3000;

const authController = require('./controllers/authController');
const quartoController = require('./controllers/quartoController');
const reservaController = require('./controllers/reservaController');

const verificarToken = require('./middlewares/authMiddleware');

app.use(express.json());

app.post('/cadastro', authController.cadastrar);
app.post('/login', authController.login);

app.post('/quartos', quartoController.cadastrarQuarto);

app.get('/quartos', reservaController.listarQuartos);
app.post('/reservas', verificarToken, reservaController.criarReserva); 

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});