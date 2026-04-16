const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 🔐 SENHA DE ADMINISTRADOR (MUDE PARA UMA SENHA SÓ SUA!)
const SENHA_ADMIN = 'DexTer13';

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve arquivos estáticos da pasta FRONTEND (estrutura correta do seu projeto)
app.use(express.static(path.join(__dirname, '..', 'FRONTEND')));

// 🔗 CONEXÃO COM MYSQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clica_e_sofre'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no banco:', err);
        return;
    }
    console.log('Conectado ao MySQL 🚀');
});

// ==========================
// 📥 CONFIGURAÇÃO DE UPLOAD (Multer)
// ==========================
if (!fs.existsSync('./uploads/fotos')) {
    fs.mkdirSync('./uploads/fotos', { recursive: true });
}

const storage = multer.diskStorage({
    destination: './uploads/fotos/',
    filename: (req, file, cb) => {
        cb(null, `candidato_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Apenas JPG, PNG ou WebP'));
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================
// 📌 CADASTRO
// ==========================
app.post('/cadastrar', async (req, res) => {
    const { nome, turma, email, senha } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const sql = "INSERT INTO usuarios (nome, turma, email, senha) VALUES (?, ?, ?, ?)";

        db.query(sql, [nome, turma, email, senhaHash], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ erro: "Erro ao cadastrar usuário" });
            }
            res.json({ mensagem: "Usuário cadastrado com sucesso", id: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro interno" });
    }
});

// ==========================
// 📌 LOGIN
// ==========================
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT * FROM usuarios WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro no servidor" });
        }
        if (result.length === 0) {
            return res.status(400).json({ erro: "Usuário não encontrado" });
        }
        const usuario = result[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json({ erro: "Senha incorreta" });
        }
        res.json({
            mensagem: "Login realizado",
            usuario_id: usuario.id,
            turma: usuario.turma
        });
    });
});

// ==========================
// 📌 VOTAR
// ==========================
app.post('/votar', (req, res) => {
    const { usuario_id, turma, chapa } = req.body;

    db.query("SELECT * FROM votos WHERE usuario_id = ?", [usuario_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao verificar voto" });
        }
        if (result.length > 0) {
            return res.status(400).json({ erro: "Você já votou!" });
        }
        db.query(
            "INSERT INTO votos (usuario_id, turma, chapa) VALUES (?, ?, ?)",
            [usuario_id, turma, chapa],
            (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ erro: "Erro ao registrar voto" });
                }
                res.json({ mensagem: "Voto registrado com sucesso" });
            }
        );
    });
});

// ==========================
// 📌 RESULTADOS
// ==========================
app.get('/resultados', (req, res) => {
    const sql = `SELECT turma, chapa, COUNT(*) as votos FROM votos GROUP BY turma, chapa`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro ao buscar resultados" });
        }
        res.json(result);
    });
});

// ==========================
// 📌 BUSCAR CHAPAS POR TURMA
// ==========================
app.get('/chapas/:turma', (req, res) => {
    const { turma } = req.params;
    db.query(
        "SELECT * FROM candidatos WHERE turma = ? ORDER BY chapa, FIELD(cargo, 'Líder', 'Vice')",
        [turma],
        (err, results) => {
            if (err) return res.status(500).json({ erro: "Erro ao buscar candidatos" });
            res.json(results);
        }
    );
});

// ==========================
// 📌 UPLOAD DE FOTO
// ==========================
app.post('/upload-foto', upload.single('foto'), (req, res) => {
    const { candidato_id } = req.body;
    if (!req.file) return res.status(400).json({ erro: "Nenhuma imagem enviada" });

    const foto_url = `/uploads/fotos/${req.file.filename}`;
    db.query(
        "UPDATE candidatos SET foto_url = ? WHERE id = ?",
        [foto_url, candidato_id],
        (err) => {
            if (err) return res.status(500).json({ erro: "Erro ao salvar no banco" });
            res.json({ mensagem: "Foto atualizada!", foto_url });
        }
    );
});

// ==========================
// 🗑️ RESETAR VOTOS (Admin com Senha)
// ==========================
app.delete('/resetar-votos', (req, res) => {
    const { senha } = req.body;

    // 🔒 Verifica se a senha está correta
    if (!senha || senha !== SENHA_ADMIN) {
        return res.status(403).json({ erro: '🔒 Acesso negado. Senha de administrador incorreta.' });
    }

    // ✅ Se estiver certa, zera APENAS os votos (mantém usuários e chapas)
    const sql = "DELETE FROM votos";
    db.query(sql, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: "Erro interno ao resetar votos" });
        }
        res.json({ mensagem: "✅ Banco de votos zerado com sucesso!" });
    });
});

// ==========================
// 🚀 SERVIDOR
// ==========================
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000 🔥');
});