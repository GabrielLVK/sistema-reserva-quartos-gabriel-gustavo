const usuarios = [
    { id: 1, nome: "Gabriel", email: "gabriel@email.com", senha: "123", role: "hospede" }
];

const quartos = [
    { id: 1, numero: "101", tipo: "Simples Eco", preco: 150.00, descricao: "Cama de casal, ventilador e vista para o jardim." },
    { id: 2, numero: "102", tipo: "Master Premium", preco: 350.00, descricao: "Cama king size, ar-condicionado, hidromassagem e varanda." },
    { id: 3, numero: "103", tipo: "Family Confort", preco: 250.00, descricao: "Duas camas de casal, frigobar e ar-condicionado." }
];

const reservas = [];
let proximoIdReserva = 1;
let proximoIdQuarto = 4;

const hotelRepository = {
    listarTodosQuartos: () => quartos,
    
    buscarQuartoPorId: (id) => quartos.find(q => q.id === parseInt(id)),
    
    salvarQuarto: (quarto) => {
        quarto.id = proximoIdQuarto++;
        quartos.push(quarto);
        return quarto;
    },
    
    buscarUsuarioPorEmail: (email) => usuarios.find(u => u.email === email),
    
    buscarUsuarioPorId: (id) => usuarios.find(u => u.id === parseInt(id)),
    
    salvarUsuario: (usuario) => {
        usuario.id = usuarios.length + 1;
        usuario.role = "hospede";
        usuarios.push(usuario);
        return usuario;
    },
    
    salvarReserva: (reserva) => {
        reserva.id = proximoIdReserva++;
        reserva.status = "confirmada";
        reservas.push(reserva);
        return reserva;
    },
    
    listarReservasPorUsuario: (usuarioId) => {
        return reservas.filter(r => r.usuario_id === parseInt(usuarioId));
    },
    
    cancelarReserva: (id) => {
        const reserva = reservas.find(r => r.id === parseInt(id));
        if (reserva) {
            reserva.status = "cancelada";
        }
        return reserva;
    },

    listarTodasReservasGerais: () => reservas,

    verificarConflito: (quartoId, entrada, saida) => {
        return reservas.some(r => 
            r.quarto_id === parseInt(quartoId) && 
            r.status === "confirmada" &&
            ((entrada >= r.data_entrada && entrada < r.data_saida) || 
             (saida > r.data_entrada && saida <= r.data_saida))
        );
    }
};

module.exports = hotelRepository;