function verificarIdade() {

    let idade = Number(document.getElementById("idade").value);

    let resultado = document.getElementById("resultado");

    if (idade < 16) {

        resultado.innerHTML = "Você não pode votar.";

    }

    else if (idade < 18 || idade > 70) {

        resultado.innerHTML = "Seu voto é opcional.";

    }

    else {

        resultado.innerHTML = "Seu voto é obrigatório.";

    }
}


function verificarVoto() {

    let voto = Number(document.getElementById("voto").value);

    let resultado = document.getElementById("resultado");

    while (voto != 80) {

        resultado.innerHTML = "Voto inválid";

        return;
    }

    resultado.innerHTML = "Voto confirmado no candidato 80!";
}