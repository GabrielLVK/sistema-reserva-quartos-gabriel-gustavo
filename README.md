# EcoStay - Sistema de Reservas de Hotel

Este é o projeto prático desenvolvido para a matéria de Programação Web no 4º semestre da Unochapecó. O sistema simula o funcionamento de um hotel ecológico, permitindo o cadastro de usuários, visualização de quartos e agendamento de reservas.

## 🚀 Tecnologias Utilizadas

* **Back-end:** Node.js com Express
* **Gerenciamento de Sessão:** express-session
* **Front-end:** HTML5, JavaScript (Fetch API) e Tailwind CSS (via CDN)
* **Persistência:** Dados armazenados em memória (Arrays no Repositório)

## 📦 Como Rodar o Projeto

Para testar o projeto localmente, siga os passos abaixo:

1. Clone o repositório para a sua máquina:
   git clone <https://github.com/GabrielLVK/sistema-reserva-quartos-gabriel-gustavo>

2. Entre na pasta do projeto:
   cd ecostay

3. Instale as dependências necessárias:
   npm install

4. Inicie o servidor em modo de desenvolvimento (usando o nodemon):
   npm run dev

5. Abra o navegador e acesse:
   http://localhost:3000

## 👥 Usuários de Teste

Para testar as diferentes permissões do sistema (Hóspede vs Admin), você pode usar as credenciais abaixo que já vêm cadastradas por padrão no sistema:

* **Hóspede:** gabriel@email.com | Senha: 123
* **Admin:** admin@ecostay.com | Senha: admin123

## 📂 Estrutura do Código

* /src/repositories: Manipulação direta dos dados (quartos, usuários e reservas).
* /src/services: Regras de negócio e validações.
* /src/routes: Endpoints da API e renderização das telas.
* /src/views: Páginas HTML individuais da interface do usuário (Home, Login, Cadastro, Catálogo, Reservas).
* /Relatorios: PDFs com os relatórios individuais de desenvolvimento de cada integrante.