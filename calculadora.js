function somar(){
    let n1 = Number(document.getElementById("num1").value);
      let n2 = Number(document.getElementById("num2").value);

    document.getElementById("resultado").innerHTML = "Resultado: " + (n1 + n2);
}
function subtrair(){
    let n1 = Number(document.getElementById("num1").value);
      let n2 = Number(document.getElementById("num2").value);

    document.getElementById("resultado").innerHTML = "Resultado: " + (n1 - n2);
}
function dividir(){
    let n1 = Number(document.getElementById("num1").value);
      let n2 = Number(document.getElementById("num2").value);

    if (n2 == 0){
        document.getElementById("resultao").innerHTML = 
        "Não é possivel dividir por zero!";
    }  else {
      document.getElementById("resultado").innerHTML = "Resultado: " + (n1 / n2);
    }
} 
function multiplicar(){
    let n1 = Number(document.getElementById("num1").value);
      let n2 = Number(document.getElementById("num2").value);

    document.getElementById("resultado").innerHTML = "Resultado: " + (n1 * n2);
}
