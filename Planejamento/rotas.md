# Definição das Rotas do Sistema - EcoStay

O sistema divide suas rotas entre públicas (acessíveis por qualquer visitante) e privadas (protegidas pelo middleware de autenticação baseado em sessão).

## 1. Rotas Públicas (Autenticação e Visualização Básica)

| Método HTTP | Rota | Finalidade / Descrição |
| :--- | :--- | :--- |
| **GET** | `/` | Página inicial do sistema (Home) com apresentação do hotel. |
| **GET** | `/quartos` | Listagem principal de todos os quartos para consulta de preços e tipos. |
| **GET** | `/login` | Renderiza a tela de login do usuário. |
| **POST** | `/login` | Processa a autenticação do usuário e inicia a sessão (`req.session`). |
| **GET** | `/cadastro` | Renderiza o formulário de criação de nova conta (Hóspede). |
| **POST** | `/cadastro` | Processa os dados do formulário e cria um novo usuário no sistema. |

## 2. Rotas Privadas (Apenas Usuários Autenticados)

Essas rotas passam obrigatoriamente pelo `authMiddleware`. Caso o usuário não esteja logado, ele é redirecionado para a página de erro ou login.

### Área do Hóspede (Reservas)
| Método HTTP | Rota | Finalidade / Descrição |
| :--- | :--- | :--- |
| **GET** | `/reservas` | Exibe o painel do usuário logado com o histórico de suas reservas (Tela Privada). |
| **GET** | `/reservas/nova` | Renderiza o formulário para criação de uma nova reserva para um quarto específico. |
| **POST** | `/reservas` | Recebe as datas de check-in/check-out e cria a reserva (dispara validações no Service). |
| **POST** | `/reservas/:id/cancelar` | Altera o status de uma reserva específica para "Cancelada". |
| **GET** | `/logout` | Destrói a sessão ativa do usuário e o redireciona para a home pública. |

### Área do Administrador (Gerenciamento de Quartos - CRUD)
*Nota: Além de estar logado, o middleware valida se o campo `role` do usuário é igual a `admin`.*

| Método HTTP | Rota | Finalidade / Descrição |
| :--- | :--- | :--- |
| **GET** | `/admin/quartos/novo` | Renderiza o formulário de cadastro de um novo quarto. |
| **POST** | `/admin/quartos` | Recebe os dados e cria um novo quarto no repositório. |
| **GET** | `/admin/quartos/:id/editar` | Renderiza o formulário de edição com os dados atuais do quarto. |
| **POST** | `/admin/quartos/:id/editar` | Processa a atualização dos dados do quarto (Simula o método PUT via POST/Method-Override). |
| **POST** | `/admin/quartos/:id/deletar` | Remove um quarto do sistema (Simula o método DELETE). |

## 3. Rota de Tratamento de Erros
| Método HTTP | Rota | Finalidade / Descrição |
| :--- | :--- | :--- |
| **GET** | `/erro` | Renderiza a página de erro genérica ou aviso de "Acesso Negado / Não Autorizado". |