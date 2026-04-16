fetch('http://localhost:3000/resultados')
.then(res => res.json())
.then(data => {
    const div = document.getElementById('resultados');

    if (!data || data.length === 0) {
        div.innerHTML = "<p style='color:white'>Nenhum voto ainda.</p>";
        return;
    }

    let html = "";

    data.forEach(item => {
        html += `
            <div class="card">
                <p>🏫 <b>${item.turma}</b></p>
                <p>🗳️ ${item.chapa}</p>
                <p>📊 ${item.votos} votos</p>
            </div>
        `;
    });

    div.innerHTML = html;
});