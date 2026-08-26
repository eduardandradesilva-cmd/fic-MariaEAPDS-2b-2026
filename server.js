const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const arquivoBanco = "./banco.json";


function lerBanco() {
    const dados = fs.readFileSync(arquivoBanco, "utf8");

    return JSON.parse(dados);
}


function salvarBanco(banco) {
    fs.writeFileSync(
        arquivoBanco,
        JSON.stringify(banco, null, 2)
    );
}


// CRIAR PERSONAGEM

app.post("/personagens", (req, res) => {

    const banco = lerBanco();

    const personagem = {

        id: Date.now(),

        nome: req.body.nome,

        profissao: req.body.profissao,

        estilo: req.body.estilo,

        avatar: req.body.avatar || "👩🏻",

        moedas: 100,

        energia: 100,

        nivel: 1

    };

    banco.personagens.push(personagem);

    salvarBanco(banco);

    res.json(personagem);
});


// LISTAR PERSONAGENS

app.get("/personagens", (req, res) => {

    const banco = lerBanco();

    res.json(banco.personagens);

});


// ATUALIZAR PERSONAGEM

app.put("/personagens/:id", (req, res) => {

    const banco = lerBanco();

    const id = Number(req.params.id);

    const personagem =
        banco.personagens.find(p => p.id === id);


    if (!personagem) {

        return res.status(404).json({
            erro: "Personagem não encontrada"
        });

    }


    personagem.nome =
        req.body.nome ?? personagem.nome;

    personagem.profissao =
        req.body.profissao ?? personagem.profissao;

    personagem.estilo =
        req.body.estilo ?? personagem.estilo;

    personagem.avatar =
        req.body.avatar ?? personagem.avatar;


    salvarBanco(banco);

    res.json(personagem);

});


// EXCLUIR PERSONAGEM

app.delete("/personagens/:id", (req, res) => {

    const banco = lerBanco();

    const id = Number(req.params.id);

    banco.personagens =
        banco.personagens.filter(
            p => p.id !== id
        );


    salvarBanco(banco);

    res.json({
        mensagem: "Personagem excluída!"
    });

});


// INICIAR SERVIDOR

app.listen(3000, () => {

    console.log(
        "🎀 Barbie Dream World está funcionando!"
    );

    console.log(
        "http://localhost:3000"
    );

});