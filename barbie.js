function mostrarCriacao() {

    document
        .getElementById("inicio")
        .classList.add("escondida");

    document
        .getElementById("criacao")
        .classList.remove("escondida");

}


function iniciarJogo() {

    const nome =
        document.getElementById("nome").value;

    const profissao =
        document.getElementById("profissao").value;


    if (nome === "") {

        alert(
            "🎀 Digite um nome para sua personagem!"
        );

        return;

    }


    document
        .getElementById("nomeJogador")
        .textContent =
        "✨ " + nome;


    document
        .getElementById("profissaoJogador")
        .textContent =
        "💼 Você é " + profissao;


    document
        .getElementById("criacao")
        .classList.add("escondida");

    document
        .getElementById("jogo")
        .classList.remove("escondida");

}


function irPara(local) {

    const mensagem =
        document.getElementById("mensagem");


    mensagem.textContent =
        "✨ Você foi para o " +
        local +
        "!";


}