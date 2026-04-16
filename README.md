# Sistema de Votação Escolar

Projeto de um sistema de votação para uso escolar, com frontend em HTML/CSS/JavaScript e backend em Node.js com Express.

## Visão geral

- `BACKEND/` contém a API Node.js que gerencia cadastro, login, votação e resultados.
- `FRONTEND/` contém as páginas de interface, incluindo login/cadastro, seleção de chapas e confirmação.
- `DATABASE/` contém a estrutura inicial do banco de dados MySQL.
- `uploads/` armazena imagens enviadas para os candidatos.

## Funcionalidades principais

- Cadastro de usuários com hash de senha usando `bcrypt`
- Login de usuário
- Votação por chapa para cada turma
- Controle para impedir voto duplicado pelo mesmo usuário
- Consulta dos resultados agregados por turma e chapa
- Upload de fotos de candidato via `multer`
- Rota administrativa para resetar os votos com senha

## Tecnologias usadas

- Backend: `Node.js`, `Express`, `MySQL` (`mysql2`), `bcrypt`, `cors`, `multer`
- Frontend: `HTML`, `CSS`, `JavaScript`
- Banco de dados: `MySQL`

## Estrutura do banco de dados

O script `DATABASE/setup.sql` cria o banco de dados e as tabelas iniciais:

- `usuarios` (id, nome, turma, email, senha)
- `votos` (id, usuario_id, turma, chapa)

## Como rodar o projeto

1. Instale as dependências do backend:

```bash
cd BACKEND
npm install
```

2. Configure o MySQL em `BACKEND/server.js` se necessário:

- `host`
- `user`
- `password`
- `database`

3. Crie o banco de dados a partir de `DATABASE/setup.sql`.

4. Inicie o servidor:

```bash
npm start
```

5. Acesse a aplicação em:

```text
http://localhost:3000
```

> O servidor já serve os arquivos estáticos do frontend a partir da pasta `FRONTEND`.

## Rotas principais do backend

- `POST /cadastrar` - cadastra usuário
- `POST /login` - autentica usuário
- `POST /votar` - registra voto
- `GET /resultados` - retorna resultados por turma e chapa
- `GET /chapas/:turma` - lista chapas por turma
- `POST /upload-foto` - faz upload de foto do candidato
- `DELETE /resetar-votos` - apaga todos os votos (requer senha admin)

## Observações importantes

- A senha de administrador está definida em `BACKEND/server.js` na constante `SENHA_ADMIN`.
- Altere a senha e as credenciais do MySQL antes de usar em produção.
- Certifique-se de que a pasta `BACKEND/uploads/fotos/` existe ou será criada automaticamente.

## Melhorias sugeridas

- Adicionar validação mais robusta no frontend e backend
- Implementar sessões/autenticação real com tokens
- Criar uma tabela de `candidatos` em `setup.sql` para suportar chapas dinâmicas
- Adicionar interface administrativa para gerenciamento de chapas e resultados
