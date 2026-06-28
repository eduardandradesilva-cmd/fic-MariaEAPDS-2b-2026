document.addEventListener("DOMContentLoaded", () => {

    const botao = document.getElementById("btnSeparar");

    botao.addEventListener("click", () => {

        let texto = document.getElementById("nomes").value;

        let nomes = texto.split(",");

        let lista = "";

        nomes.forEach(nome => {

            lista += `<li>${nome.trim()}</li>`;

        });

        document.getElementById("resultado").innerHTML = lista;

        document.getElementById("quantidade").innerHTML =
            `Total de nomes: ${nomes.length}`;

    });

});