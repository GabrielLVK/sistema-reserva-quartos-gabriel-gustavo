const repo = require('../repositories/hotelRepository');

const hotelService = {
    autenticar: (email, senha) => {
        const usuario = repo.buscarUsuarioPorEmail(email);
        if (!usuario || usuario.senha !== senha) {
            throw new Error("E-mail ou senha inválidos.");
        }
        return usuario;
    },

    cadastrarHospede: (nome, email, senha) => {
        if (!nome || !email || !senha) throw new Error("Todos os campos são obrigatórios.");
        if (repo.buscarUsuarioPorEmail(email)) throw new Error("E-mail já cadastrado.");
        return repo.salvarUsuario({ nome, email, senha, role: 'user' });
    },

    criarReserva: (usuarioId, quartoId, entrada, saida) => {
        if (!quartoId || !entrada || !saida) throw new Error("Preencha todas as datas.");
        if (entrada >= saida) throw new Error("A data de entrada deve ser anterior à data de saída.");
        
        const conflito = repo.verificarConflito(quartoId, entrada, saida);
        if (conflito) throw new Error("Este quarto já está ocupado neste período.");

        const quarto = repo.buscarQuartoPorId(quartoId);
        return repo.salvarReserva({ usuario_id: usuarioId, quarto_id: quartoId, tipoQuarto: quarto.tipo, data_entrada: entrada, data_saida: saida });
    }
};

module.exports = hotelService;