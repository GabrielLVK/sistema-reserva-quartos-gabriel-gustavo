const express = require('express');
const session = require('express-session');
const hotelRoutes = require('./routes/hotelRoutes');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'ecostay_session_secret',
    resave: false,
    saveUninitialized: true
}));

app.use('/', hotelRoutes);

app.listen(PORT, () => {
    console.log(`Servidor do EcoStay rodando perfeitamente na porta ${PORT}`);
});