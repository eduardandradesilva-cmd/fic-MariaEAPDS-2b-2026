
const jogo = document.getElementById("jogo");
const personagem = document.getElementById("personagem");
const pontuacao = document.getElementById("pontuacao");

const cadastro = document.getElementById("cadastro");
const menuJogador = document.getElementById("menuJogador");
const gameOver = document.getElementById("gameOver");

const nomeJogador = document.getElementById("nomeJogador");
const botaoCriar = document.getElementById("botaoCriar");
const botaoJogar = document.getElementById("botaoJogar");
const botaoTrocar = document.getElementById("botaoTrocar");
const botaoNovamente = document.getElementById("botaoNovamente");
const botaoTrocarGameOver = document.getElementById("botaoTrocarGameOver");

const mensagemCadastro = document.getElementById("mensagemCadastro");
const nomeSelecionado = document.getElementById("nomeSelecionado");
const dadosJogador = document.getElementById("dadosJogador");
const listaJogadores = document.getElementById("listaJogadores");
const resultado = document.getElementById("resultado");

const CHAVE_JOGADORES = "barbieDreamWorldJogadores";
const DISTANCIA_ENTRE_LOCAIS = 1500;

let jogadores = carregarJogadores();
let jogadorAtual = null;

let jogando = false;
let pulando = false;
let pontos = 0;
let velocidade = 5;
let ultimoObstaculo = 0;
let ultimoTempo = 0;
let quadroAnimacao = null;
let temporizadorObstaculo = 0;

let obstaculos = [];
let locais = [];
let elementosCenario = [];

function carregarJogadores() {
    try {
        const dados = JSON.parse(
            localStorage.getItem(CHAVE_JOGADORES)
        );

        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

function salvarJogadores() {
    localStorage.setItem(
        CHAVE_JOGADORES,
        JSON.stringify(jogadores)
    );
}

function mostrarTela(tela) {
    cadastro.classList.add("escondido");
    menuJogador.classList.add("escondido");
    gameOver.classList.add("escondido");

    tela.classList.remove("escondido");
}

function criarJogador() {
    const nome = nomeJogador.value.trim();

    if (!nome) {
        mensagemCadastro.textContent =
            "Digite um nome para criar seu jogador.";
        nomeJogador.focus();
        return;
    }

    const jogador = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        nome: nome,
        pontuacao: 0,
        partidas: 0,
        locaisDesbloqueados: []
    };

    jogadores.push(jogador);
    salvarJogadores();

    jogadorAtual = jogador;
    nomeJogador.value = "";
    mensagemCadastro.textContent = "";

    mostrarMenuJogadores();
}

function mostrarMenuJogadores() {
    pararJogo();
    mostrarTela(menuJogador);
    renderizarJogadores();
    atualizarJogadorSelecionado();
}

function atualizarJogadorSelecionado() {
    if (!jogadorAtual) {
        nomeSelecionado.textContent = "Selecione um jogador";
        dadosJogador.textContent =
            "Escolha um jogador para começar.";
        botaoJogar.disabled = true;
        return;
    }

    nomeSelecionado.textContent = jogadorAtual.nome;

    dadosJogador.textContent =
        `Recorde: ${jogadorAtual.pontuacao || 0} pontos | ` +
        `Partidas: ${jogadorAtual.partidas || 0}`;

    botaoJogar.disabled = false;
}

function renderizarJogadores() {
    listaJogadores.replaceChildren();

    if (jogadores.length === 0) {
        const aviso = document.createElement("p");
        aviso.textContent = "Nenhum jogador cadastrado ainda.";
        listaJogadores.appendChild(aviso);
        return;
    }

    jogadores.forEach(jogador => {
        const linha = document.createElement("div");
        linha.className = "linha-jogador";

        const informacoes = document.createElement("div");
        informacoes.className = "informacoes-jogador";

        const nome = document.createElement("strong");
        nome.textContent = jogador.nome;

        const detalhes = document.createElement("span");
        detalhes.textContent =
            `Recorde: ${jogador.pontuacao || 0} pontos | ` +
            `Partidas: ${jogador.partidas || 0}`;

        informacoes.append(nome, detalhes);

        const acoes = document.createElement("div");
        acoes.className = "acoes-jogador";

        const selecionar = document.createElement("button");
        selecionar.type = "button";
        selecionar.textContent =
            jogadorAtual && jogadorAtual.id === jogador.id
                ? "Selecionado"
                : "Selecionar";

        selecionar.addEventListener("click", () => {
            jogadorAtual = jogador;
            atualizarJogadorSelecionado();
            renderizarJogadores();
        });

        const editar = document.createElement("button");
        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", () => {
            editarJogador(jogador.id);
        });

        const excluir = document.createElement("button");
        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", () => {
            excluirJogador(jogador.id);
        });

        acoes.append(selecionar, editar, excluir);
        linha.append(informacoes, acoes);
        listaJogadores.appendChild(linha);
    });
}

function editarJogador(id) {
    const jogador = jogadores.find(item => item.id === id);

    if (!jogador) return;

    const novoNome = prompt("Digite o novo nome:", jogador.nome);

    if (novoNome === null) return;

    const nome = novoNome.trim();

    if (!nome) {
        alert("O nome não pode ficar vazio.");
        return;
    }

    jogador.nome = nome;

    if (jogadorAtual && jogadorAtual.id === id) {
        jogadorAtual = jogador;
    }

    salvarJogadores();
    renderizarJogadores();
    atualizarJogadorSelecionado();
}

function excluirJogador(id) {
    const jogador = jogadores.find(item => item.id === id);

    if (!jogador) return;

    const confirmar = confirm(
        `Deseja excluir o jogador "${jogador.nome}"?`
    );

    if (!confirmar) return;

    jogadores = jogadores.filter(item => item.id !== id);

    if (jogadorAtual && jogadorAtual.id === id) {
        jogadorAtual = null;
    }

    salvarJogadores();
    renderizarJogadores();
    atualizarJogadorSelecionado();

    if (jogadores.length === 0) {
        mostrarTela(cadastro);
        mensagemCadastro.textContent =
            "Crie um jogador para começar!";
    }
}

function prepararCenario() {
    const cenario = jogo.querySelector(".ceu");
    const objetos = document.getElementById("objetosMovel");

    elementosCenario = [];

    if (cenario) {
        cenario.querySelectorAll(".nuvem").forEach(elemento => {
            elementosCenario.push({
                elemento,
                x: elemento.offsetLeft,
                velocidade: 0.35
            });
        });
    }

    if (objetos) {
        objetos.querySelectorAll(".arbusto, .flor").forEach(elemento => {
            elementosCenario.push({
                elemento,
                x: elemento.offsetLeft,
                velocidade: 1.2
            });
        });
    }
}

function prepararMapa() {
    locais.forEach(local => local.elemento.remove());
    locais = [];

    const regioes = [
        { classe: "casa", nome: "Dreamhouse", simbolo: "🏠" },
        { classe: "hospital", nome: "Hospital", simbolo: "🏥" },
        { classe: "parque", nome: "Parque", simbolo: "🌳" },
        { classe: "escola", nome: "Escola", simbolo: "🏫" }
    ];

    const largura = jogo.clientWidth;

    regioes.forEach((regiao, indice) => {
        const local = document.createElement("div");
        local.className = `local-mapa ${regiao.classe}`;

        const construcao = document.createElement("div");
        construcao.className = "construcao";
        construcao.textContent = regiao.simbolo;

        const nome = document.createElement("div");
        nome.className = "nome-local";
        nome.textContent = regiao.nome;

        local.append(construcao, nome);
        jogo.appendChild(local);

        const x = largura + 300 + indice * DISTANCIA_ENTRE_LOCAIS;
        local.style.left = `${x}px`;

        locais.push({
            elemento: local,
            x,
            nome: regiao.nome,
            salvo: false
        });
    });
}

function salvarProgressoLocal(local) {
    if (!jogadorAtual || local.salvo) return;

    local.salvo = true;

    if (!Array.isArray(jogadorAtual.locaisDesbloqueados)) {
        jogadorAtual.locaisDesbloqueados = [];
    }

    if (!jogadorAtual.locaisDesbloqueados.includes(local.nome)) {
        jogadorAtual.locaisDesbloqueados.push(local.nome);
    }

    salvarJogadores();
}
 
function verificarSavePoints() {
    if (!jogando || !jogadorAtual) return;

    const posicaoBarbie = personagem.getBoundingClientRect();
    const limiteBarbie = posicaoBarbie.right;

    locais.forEach(local => {
        const posicaoLocal = local.elemento.getBoundingClientRect();

        if (
            !local.salvo &&
            posicaoLocal.left <= limiteBarbie &&
            posicaoLocal.right >= posicaoBarbie.left
        ) {
            salvarProgressoLocal(local);
        }
    });
}

function iniciarJogo() {
    if (!jogadorAtual) {
        mostrarTela(cadastro);
        mensagemCadastro.textContent =
            "Crie ou selecione um jogador primeiro.";
        return;
    }

    pararJogo();

    jogando = true;
    pulando = false;
    pontos = 0;
    velocidade = 5;
    ultimoObstaculo = 0;
    ultimoTempo = 0;
    temporizadorObstaculo = 0;

    obstaculos = [];

    document.querySelectorAll(".obstaculo").forEach(elemento => {
        elemento.remove();
    });

    personagem.classList.remove("pulando");
    personagem.style.bottom = "85px";

    pontuacao.textContent = "00000";

    prepararCenario();
    prepararMapa();

    mostrarTela(gameOver);
    gameOver.classList.add("escondido");

    quadroAnimacao = requestAnimationFrame(atualizarJogo);
}

function pararJogo() {
    jogando = false;

    if (quadroAnimacao !== null) {
        cancelAnimationFrame(quadroAnimacao);
        quadroAnimacao = null;
    }
}

function criarObstaculo() {
    const obstaculo = document.createElement("div");
    obstaculo.className = "obstaculo";

    const tipo = Math.random();

    if (tipo < 0.35) {
        obstaculo.classList.add("pequeno");
    } else if (tipo > 0.75) {
        obstaculo.classList.add("alto");
    }

    obstaculo.style.left = `${jogo.clientWidth + 20}px`;
    jogo.appendChild(obstaculo);

    obstaculos.push({
        elemento: obstaculo,
        x: jogo.clientWidth + 20
    });
}

function moverObstaculos(delta) {
    obstaculos = obstaculos.filter(obstaculo => {
        obstaculo.x -= velocidade * delta;
        obstaculo.elemento.style.left = `${obstaculo.x}px`;

        if (obstaculo.x < -80) {
            obstaculo.elemento.remove();
            return false;
        }

        return true;
    });
}

function moverCenario(delta) {
    elementosCenario.forEach(item => {
        item.x -= item.velocidade * delta;

        if (item.x < -100) {
            item.x = jogo.clientWidth + Math.random() * 250;
        }

        item.elemento.style.left = `${item.x}px`;
    });
}

function moverLocaisMapa(delta) {
    locais.forEach(local => {
        local.x -= velocidade * 0.65 * delta;

        if (local.x < -230) {
            const maiorX = Math.max(
                jogo.clientWidth,
                ...locais.map(item => item.x)
            );

            local.x = maiorX + DISTANCIA_ENTRE_LOCAIS;
            local.salvo = false;
        }

        local.elemento.style.left = `${local.x}px`;
    });
}

function pular() {
    if (!jogando || pulando) return;

    pulando = true;
    personagem.classList.remove("pulando");

    void personagem.offsetWidth;

    personagem.classList.add("pulando");

    setTimeout(() => {
        personagem.classList.remove("pulando");
        personagem.style.bottom = "85px";
        pulando = false;
    }, 650);
}

function verificarColisoes() {
    const boneca = personagem.getBoundingClientRect();
    const margem = 10;

    const areaBoneca = {
        left: boneca.left + margem,
        right: boneca.right - margem,
        top: boneca.top + margem,
        bottom: boneca.bottom - 3
    };

    for (const obstaculo of obstaculos) {
        const caixa = obstaculo.elemento.getBoundingClientRect();

        const colidiu =
            areaBoneca.left < caixa.right - 5 &&
            areaBoneca.right > caixa.left + 5 &&
            areaBoneca.top < caixa.bottom &&
            areaBoneca.bottom > caixa.top + 5;

        if (colidiu) {
            finalizarJogo();
            return;
        }
    }
}

function atualizarPontuacao(delta) {
    pontos += delta * 0.1;

    const valor = Math.floor(pontos);

    pontuacao.textContent = String(valor).padStart(5, "0");

    velocidade = Math.min(5 + valor / 250, 10);
}

function atualizarJogo(tempo) {
    if (!jogando) return;

    if (!ultimoTempo) ultimoTempo = tempo;

    const delta = Math.min((tempo - ultimoTempo) / 16.67, 3);
    ultimoTempo = tempo;

    temporizadorObstaculo += tempo - (ultimoObstaculo || tempo);
    ultimoObstaculo = tempo;

    if (temporizadorObstaculo > 1250 + Math.random() * 700) {
        criarObstaculo();
        temporizadorObstaculo = 0;
    }

    moverObstaculos(delta);
    moverCenario(delta);
    moverLocaisMapa(delta);
    atualizarPontuacao(delta);
    verificarColisoes();
    verificarSavePoints();

    if (jogando) {
        quadroAnimacao = requestAnimationFrame(atualizarJogo);
    }
}

function finalizarJogo() {
    pararJogo();

    const pontosFinais = Math.floor(pontos);

    if (jogadorAtual) {
        jogadorAtual.partidas = (jogadorAtual.partidas || 0) + 1;

        if (pontosFinais > (jogadorAtual.pontuacao || 0)) {
            jogadorAtual.pontuacao = pontosFinais;
        }

        salvarJogadores();
    }

    resultado.textContent =
        `${jogadorAtual ? jogadorAtual.nome : "Jogador"}, ` +
        `você fez ${pontosFinais} pontos!`;

    mostrarTela(gameOver);
}

botaoCriar.addEventListener("click", criarJogador);

nomeJogador.addEventListener("keydown", evento => {
    if (evento.key === "Enter") {
        criarJogador();
    }
});

botaoJogar.addEventListener("click", iniciarJogo);
botaoNovamente.addEventListener("click", iniciarJogo);

botaoTrocar.addEventListener("click", () => {
    jogadorAtual = null;
    mostrarTela(cadastro);
    mensagemCadastro.textContent = "";
    nomeJogador.focus();
});

botaoTrocarGameOver.addEventListener("click", mostrarMenuJogadores);

document.addEventListener("keydown", evento => {
    if (evento.code === "Space" || evento.code === "ArrowUp") {
        if (jogando) {
            evento.preventDefault();
            pular();
        }
    }
});

jogo.addEventListener("pointerdown", evento => {
    if (jogando && !evento.target.closest("button, input")) {
        pular();
    }
});

prepararCenario();

if (jogadores.length > 0) {
    jogadorAtual = jogadores[0];
    mostrarMenuJogadores();
} else {
    mostrarTela(cadastro);
}
