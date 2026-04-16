let selecionado = null;

// ================= CADASTRO =================
function entrar() {
    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!nome || !turma || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            turma,
            email,
            senha
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.erro) {
                alert(data.erro);
                return;
            }

            localStorage.setItem("usuario_id", data.id);
            localStorage.setItem("turma", turma);

            window.location.href = "chapas.html";
        })
        .catch(err => {
            console.error(err);
            alert("Erro ao conectar com o servidor");
        });
}

// ================= BANCO DE CHAPAS =================
const chapas = {
    "1A": [
        { nome: "Chapa 1", lider: "-----", vice: "-----", img: "img/1A-1.jpg" },
        { nome: "Chapa 2", lider: "-----", vice: "-----", img: "img/1A-2.jpg" }
    ],
    "1B": [
        { nome: "Chapa 1", lider: "-----", vice: "-----", img: "img/1B-1.jpg" },
        { nome: "Chapa 2", lider: "-----", vice: "-----", img: "img/1B-2.jpg" }
    ],
    "2A": [
        { nome: "Chapa 1", lider: "-----", vice: "-----", img: "img/2A-1.jpg" },
        { nome: "Chapa 2", lider: "-----", vice: "-----", img: "img/2A-2.jpg" }
    ],
    "2B": [
        { nome: "Chapa 1", lider: "-----", vice: "-----", img: "img/2B-1.jpg" },
        { nome: "Chapa 2", lider: "-----", vice: "-----", img: "img/2B-2.jpg" }
    ],
    "3A": [
        { nome: "Chapa 1", lider: "-----", vice: "-----", img: "img/3A-1.jpg" },
        { nome: "Chapa 2", lider: "-----", vice: "-----", img: "img/3A-2.jpg" }
    ]
};

// ================= CARREGAR CHAPAS =================
window.onload = function () {

    let turma = localStorage.getItem("turma");

    if (!turma && window.location.pathname.includes("chapas.html")) {
        window.location.href = "index.html";
    }

    // 🔥 CORRIGE FORMATO DA TURMA
    turma = turma
        .toUpperCase()
        .replace("º", "")
        .replace("ANO", "")
        .replace(/\s+/g, "");

    console.log("Turma:", turma);

    let titulo = document.getElementById("titulo-turma");

    if (titulo) {
        let turmaFormatada = turma[0] + "º Ano " + turma[1];
        titulo.innerText = "Votação - " + turmaFormatada;
    }

    let lista = document.getElementById("lista-chapas");

    if (!chapas[turma]) {
        lista.innerHTML = "<p>Não há chapas para sua turma.</p>";
        return;
    }

    chapas[turma].forEach(chapa => {
        let div = document.createElement("div");
        div.classList.add("chapa");

        div.innerHTML = `
    <h3>${chapa.nome}</h3>

    <div class="perfil">
        <div class="icone">👤</div>
        <p>${chapa.lider}</p>
    </div>

    <div class="perfil">
        <div class="icone">👤</div>
        <p>${chapa.vice}</p>
    </div>
`;

        div.onclick = () => selecionar(div, chapa.nome);

        lista.appendChild(div);
    });
};

// ================= SELECIONAR =================
function selecionar(el, nome) {
    document.querySelectorAll(".chapa").forEach(c => c.classList.remove("ativo"));
    el.classList.add("ativo");
    selecionado = nome;
}

// ================= CONFIRMAR VOTO =================
function confirmar() {
    if (!selecionado) {
        alert("Selecione uma chapa!");
        return;
    }

    const usuario_id = localStorage.getItem("usuario_id");
    const turma = localStorage.getItem("turma");

    fetch("http://localhost:3000/votar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario_id,
            turma,
            chapa: selecionado
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.erro) {
            alert(data.erro);
            return;
        }

        alert("Voto registrado com sucesso!");
        window.location.href = "confirmacao.html";
    })
    .catch(err => {
        console.error(err);
        alert("Erro ao registrar voto");
    });
}

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 80; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(p.x, p.y, 2, 2);

        particles.forEach(p2 => {
            let dx = p.x - p2.x;
            let dy = p.y - p2.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                ctx.strokeStyle = "rgba(255,255,255,0.05)";
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animate);
}

animate();