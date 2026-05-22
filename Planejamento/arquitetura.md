# Planejamento Técnico e Arquitetura

## Estrutura de Pastas Proposta

src/
├── controllers/     # Capturam requisições, chamam os serviços e retornam respostas/views
├── services/        # Contêm as regras de negócio (validação de datas, disponibilidade)
├── repositories/    # Responsáveis pelo acesso e manipulação dos dados (Mockados em memória/JSON)
├── middlewares/     # Validação de sessão (rotas protegidas) e logs
├── routes/          # Definição dos endpoints da aplicação
├── views/           # Telas em HTML/EJS
└── app.js           # Inicialização do Express e configuração de middlewares genéricos