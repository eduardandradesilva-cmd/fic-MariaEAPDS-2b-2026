document.addEventListener("DOMContentLoaded", () => {

    let pessoas = [];

    const botao = document.getElementById("btnAdicionar");

    console.log(botao);

    botao.addEventListener("click", () => {

        let nome = document.getElementById("nome").value;
        let idade = Number(document.getElementById("idade").value);

        pessoas.push({ nome, idade });

        let soma = 0;
        let lista = "";

        pessoas.forEach((pessoa) => {
            soma += pessoa.idade;
            lista += `<li>${pessoa.nome} - ${pessoa.idade} anos</li>`;
        });

        let media = soma / pessoas.length;

        document.getElementById("lista").innerHTML = lista;
        document.getElementById("media").innerHTML =
            `Média das idades: ${media.toFixed(1)}`;

    });

});