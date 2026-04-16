let paginaAtual = 1;
const chapasPorPagina = 6;
const totalChapas = 24;

function carregarChapas() {
    const grid = document.getElementById('grid-chapas');
    const indicador = document.getElementById('page-indicator');
    grid.innerHTML = ""; // Limpa a tela

    const inicio = (paginaAtual - 1) * chapasPorPagina + 1;
    const fim = Math.min(inicio + chapasPorPagina - 1, totalChapas);

    for (let i = inicio; i <= fim; i++) {
        grid.innerHTML += `
            <div class="chapa-card" onclick="confirmarVoto(${i})">
                <div class="chapa-icon">
                    <img src="assets/chapa${i}.png" onerror="this.src='https://via.placeholder.com{i}'">
                </div>
                <span class="chapa-name">CHAPA-${i}</span>
            </div>
        `;
    }

    indicador.innerText = `PÁGINA ${paginaAtual} / 4`;
}

// Botões de Navegação
document.getElementById('btn-next').addEventListener('click', () => {
    if (paginaAtual < 4) {
        paginaAtual++;
        carregarChapas();
    }
});

document.getElementById('btn-prev').addEventListener('click', () => {
    if (paginaAtual > 1) {
        paginaAtual--;
        carregarChapas();
    }
});

function confirmarVoto(id) {
    if (confirm(`Confirmar voto na CHAPA-${id}?`)) {
        alert("✅ Voto registrado! Retornando ao início...");
        window.location.href = "index.html";
    }
}

// Inicializa a primeira página
carregarChapas();

for (let i = inicio; i <= fim; i++) {
    grid.innerHTML += `
        <div class="chapa-card" onclick="confirmarVoto(${i})">
            <div class="chapa-icon">
                <!-- Se você tiver a imagem chapa1.png na pasta assets, ela aparece. 
                     Se não tiver, o fundo roxo do CSS assume o lugar. -->
                <img src="assets/chapa${i}.png" alt="">
            </div>
            <span class="chapa-name">CHAPA ${i}</span>
        </div>
    `;
}

grid.innerHTML += `
    <div class="chapa-card" onclick="confirmarVoto(${i})">
        <div class="chapa-icon">
            <img src="assets/chapa${i}.png" onerror="this.style.display='none'">
        </div>
        <span class="chapa-name">CHAPA ${i}</span>
    </div>
`;