let idade = Number(prompt("Digite sua idade: "));
if (idade < 16) {
    alert("Não vota!");
}
else if (idade < 18 || idade > 70){
    alert("Voto opcional!");
}
else{
    alert ("Voto obrigatorio!")
}