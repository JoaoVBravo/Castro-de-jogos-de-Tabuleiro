// Elementos do formulário e da trava
const formulario = document.getElementById("formulario");
const campoNome = document.getElementById("campoNome");
const campoPais = document.getElementById("campoPais");
const campoImagem = document.getElementById("campoImagem");
const mensagemErro = document.getElementById("mensagemErro");

// Elementos da tabela, filtro e contador
const corpoTabela = document.getElementById("corpoTabela");
const campoFiltro = document.getElementById("campoFiltro");
const contadorRegistros = document.getElementById("contadorRegistros");

// Elementos do pop-up de imagem
const popupImagem = document.getElementById("popupImagem");
const popupTitulo = document.getElementById("popupTitulo");
const popupFoto = document.getElementById("popupFoto");
const popupFallback = document.getElementById("popupFallback");
const popupCaminhoTexto = document.getElementById("popupCaminhoTexto");

// Lista inicial com dados fixos vinculados a cada objeto (id, nome, pais e imagem)
// Substitua os caminhos de 'imagem' pelas suas fotos reais quando quiser
let Jogos_de_tabuleiro = [
    { id: 1, nome: "Disney Lorcana", pais: "Alemanha", imagem: "img/lorcana.png" },
    { id: 2, nome: "Riftbound", pais: "Estados Unidos", imagem: "img/riftbound.png" },
    { id: 3, nome: "Magic", pais: "Estados Unidos", imagem: "img/magic.png" },
    { id: 4, nome: "One Piece Card Game", pais: "Japão", imagem: "img/onepiece.png" },
    { id: 5, nome: "Yu-Gi-Oh", pais: "Japão", imagem: "img/yugioh.png" },
];

// Renderiza a tabela aplicando o filtro de busca atual
function renderizarTabela() {
    const termoBusca = campoFiltro.value.trim().toLowerCase();

    // Filtra apenas os itens cujo nome contém o texto digitado na procura
    const listaFiltrada = Jogos_de_tabuleiro.filter((jogo) =>
        jogo.nome.toLowerCase().includes(termoBusca)
    );

    // Atualiza o contador no cabeçalho do módulo [02]
    contadorRegistros.textContent = `${listaFiltrada.length} ${listaFiltrada.length === 1 ? "ITEM" : "ITENS"}`;

    if (listaFiltrada.length === 0) {
        corpoTabela.innerHTML = `
            <tr class="linha-vazia">
                <td colspan="3">NENHUM REGISTRO ENCONTRADO PARA "${campoFiltro.value}"</td>
            </tr>
        `;
        return;
    }

    // Cada linha mantém o id, nome, país e caminho da imagem fixos ao item
    corpoTabela.innerHTML = listaFiltrada
        .map(
            (jogo) => `
            <tr>
                <td 
                    class="celula-titulo" 
                    data-nome="${jogo.nome}" 
                    data-imagem="${jogo.imagem}"
                >
                    ${jogo.nome}
                </td>
                <td>${jogo.pais}</td>
                <td>
                    <button 
                        type="button" 
                        class="btn-remover" 
                        onclick="removerJogo(${jogo.id})"
                    >
                        REMOVER
                    </button>
                </td>
            </tr>
        `
        )
        .join("");
}

// Remove um item específico usando seu ID fixo
function removerJogo(idParaRemover) {
    Jogos_de_tabuleiro = Jogos_de_tabuleiro.filter((jogo) => jogo.id !== idParaRemover);
    popupImagem.hidden = true; // Garante que o pop-up feche ao excluir o item
    renderizarTabela();
}

// ==========================================================================
// TRAVA DE CADASTRO (SÓ CADASTRA SE TODOS OS QUADROS ESTIVEREM PREENCHIDOS)
// ==========================================================================
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const pais = campoPais.value.trim();
    const imagem = campoImagem.value.trim();

    // Marca visualmente qualquer campo que tenha ficado em branco
    campoNome.classList.toggle("campo-invalido", !nome);
    campoPais.classList.toggle("campo-invalido", !pais);
    campoImagem.classList.toggle("campo-invalido", !imagem);

    // Trava: interrompe o cadastro se qualquer um dos 3 quadros estiver vazio
    if (!nome || !pais || !imagem) {
        mensagemErro.hidden = false;
        return;
    }

    // Libera a trava, esconde o aviso e salva o novo objeto com ID único
    mensagemErro.hidden = true;

    Jogos_de_tabuleiro.push({
        id: Date.now(),
        nome: nome,
        pais: pais,
        imagem: imagem,
    });

    renderizarTabela();
    formulario.reset();
    campoNome.focus();
});

// Remove a borda vermelha de erro assim que o usuário começa a digitar no campo
[campoNome, campoPais, campoImagem].forEach((input) => {
    input.addEventListener("input", () => {
        if (input.value.trim()) {
            input.classList.remove("campo-invalido");
        }
        if (campoNome.value.trim() && campoPais.value.trim() && campoImagem.value.trim()) {
            mensagemErro.hidden = true;
        }
    });
});

// ==========================================================================
// FILTRO DE PROCURA POR NOME EM TEMPO REAL
// ==========================================================================
campoFiltro.addEventListener("input", () => {
    renderizarTabela();
});

// ==========================================================================
// POP-UP DE IMAGEM AO PASSAR O MOUSE SOBRE O TÍTULO NA TABELA
// ==========================================================================
corpoTabela.addEventListener("mouseover", (evento) => {
    const celula = evento.target.closest(".celula-titulo");
    if (!celula) return;

    const nomeJogo = celula.dataset.nome;
    const caminhoImagem = celula.dataset.imagem;

    popupTitulo.textContent = nomeJogo;
    popupCaminhoTexto.textContent = caminhoImagem;

    // Reseta o estado da imagem antes de carregar a nova
    popupFoto.hidden = false;
    popupFallback.hidden = true;
    popupFoto.src = caminhoImagem;

    popupImagem.hidden = false;
});

// Se o arquivo de imagem ainda não existir na pasta, exibe o aviso técnico no pop-up
popupFoto.addEventListener("error", () => {
    popupFoto.hidden = true;
    popupFallback.hidden = false;
});

// Faz o pop-up acompanhar a posição do cursor na tela
corpoTabela.addEventListener("mousemove", (evento) => {
    const celula = evento.target.closest(".celula-titulo");
    if (!celula) return;

    const deslocamentoX = 18;
    const deslocamentoY = 18;

    popupImagem.style.left = `${evento.clientX + deslocamentoX}px`;
    popupImagem.style.top = `${evento.clientY + deslocamentoY}px`;
});

// Esconde o pop-up quando o mouse sai do nome do jogo
corpoTabela.addEventListener("mouseout", (evento) => {
    const celula = evento.target.closest(".celula-titulo");
    if (!celula) return;

    popupImagem.hidden = true;
});

// Inicializa a tabela ao abrir a página
renderizarTabela();