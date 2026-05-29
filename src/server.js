const express = require('express');
const app = express();
const PORT = 3000;

const authController = require('./controllers/authController');
const quartoController = require('./controllers/quartoController');

app.use(express.json());

app.post('/cadastro', authController.cadastrar);
app.post('/login', authController.login);

app.post('/quartos', quartoController.cadastrarQuarto);

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});