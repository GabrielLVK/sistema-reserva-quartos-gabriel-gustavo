const usuarios = [];
const quartos = [
    { id: 1, numero: "101", tipo: "Standard", preco: 150, descricao: "Quarto simples com Wi-Fi e TV." },
    { id: 2, numero: "202", tipo: "Suíte Master", preco: 350, descricao: "Vista para o mar, hidromassagem e frigobar." }
];
const reservas = [];

const hotelRepository = {
    buscarUsuarioPorEmail: (email) => usuarios.find(u => u.email === email),
    salvarUsuario: (usuario) => {
        usuario.id = usuarios.length + 1;
        usuarios.push(usuario);
        return usuario;
    },

    listarTodosQuartos: () => quartos,
    buscarQuartoPorId: (id) => quartos.find(q => q.id === parseInt(id)),
    salvarQuarto: (quarto) => {
        quarto.id = quartos.length + 1;
        quartos.push(quarto);
        return quarto;
    },
    atualizarQuarto: (id, dados) => {
        const index = quartos.findIndex(q => q.id === parseInt(id));
        if (index !== -1) {
            quartos[index] = { ...quartos[index], ...dados };
            return quartos[index];
        }
        return null;
    },
    deletarQuarto: (id) => {
        const index = quartos.findIndex(q => q.id === parseInt(id));
        if (index !== -1) return quartos.splice(index, 1)[0];
        return null;
    },

    listarReservasPorUsuario: (usuarioId) => reservas.filter(r => r.usuario_id === parseInt(usuarioId)),
    verificarConflito: (quartoId, entrada, saida) => {
        return reservas.find(r => 
            r.quarto_id === parseInt(quartoId) && 
            r.status !== "Cancelada" &&
            ((entrada >= r.data_entrada && entrada <= r.data_saida) || 
             (saida >= r.data_entrada && i <= r.data_saida))
        );
    },
    salvarReserva: (reserva) => {
        reserva.id = reservas.length + 1;
        reserva.status = "Confirmada";
        reservas.push(reserva);
        return reserva;
    },
    cancelarReserva: (id) => {
        const reserva = reservas.find(r => r.id === parseInt(id));
        if (reserva) reserva.status = "Cancelada";
        return reserva;
    }
};

module.exports = hotelRepository;