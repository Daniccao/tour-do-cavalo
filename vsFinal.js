//Estabelece o cavalo que vai ser adicionado ao tabuleiro
var cavalo = document.createElement("img");
cavalo.src = "./cavalo.svg"
//Estabelece q o jogo inicio
var jogoIniciado = false;
//Contador que vai ser colocado na casa quando o cavalo sair
var contadorDeJogadas = 1;
//Pega o objeto atual que esta o cavalo
var atual = null;

//Fucao chamada quando o usuario aumenta ou diminui a quantidade de linhas e coluna
function alteraTab() {
    if(jogoIniciado){
        alert("Jogo ja Iniciado! Caso deseje alterar algo, aperte em \'Limpar\'" );
    }
    else{
        criarJogo();
    }
}

//Retorna o jogo ao estado inicial
function limpar(){
    document.getElementById("linha").value = 8;
    document.getElementById("coluna").value = 8;
    document.querySelector("p").innerHTML = '';
    criarJogo();
}

//Cria o Tabuleiro na Tela
function tabGrafico(tbody, numLinha, numColuna) {
    for (let i = 0; i < numLinha; i++) {
        let tr = document.createElement("tr");
        for (let j = 0; j < numColuna; j++) {
            let td = document.createElement("td");
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

//A funcao principal do projeto, ela inicia e reinicia o jogo
function criarJogo() {
    let tbody = document.querySelector("tbody");
    let linha = document.getElementById("linha").value;
    let coluna = document.getElementById("coluna").value;

    //Reinicia variaveis importantes
    tbody.innerHTML = "";
    jogoIniciado = false;
    contadorDeJogadas = 1;

    tabGrafico(tbody, linha, coluna);
    jogada();
}

//Responsavel por todo processamento da jogada
function jogada(){
    let table = document.querySelector("table");
    let rows = table.rows;
    var vermelha = 0;
    var preta = 0;
    var azul = 0;

    //Coloca todas as casas vermelhas de possiveis jogadas de volta para preto
    for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        for(let j = 0; j < row.cells.length; j++){
            let cell = row.cells[j];
            if(cell.style.border != Ocupada.PASSADA){
                cell.style.border = Ocupada.NORMAL;
            }
        }
    }

    //Responsavel por criar os eventos para que seja possivel o click e muda a cor das celulas de possivel jogada
    for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        for(let j = 0; j < row.cells.length; j++){
            let cell = row.cells[j];
            //Cria evento de click linkando com o play
            if(!jogoIniciado){
                cell.addEventListener("click", play);
            }
            //Se o jogo ja estiver iniciado ele manda as coordenadas para a funcao mudaCor para colocar a cor vermelha nas celulas possiveis de ser jogada
            else{
                if(atual == cell){
                    mudaCor(i, j);
                }
            }    
        }
    }

    //Conta o numero de celulas de cada cor para estabelecer o fim de jogo
    for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        for(let j = 0; j < row.cells.length; j++){
            let cell = row.cells[j];
            if(cell.style.border == Ocupada.POSSIBILIDADE){
                vermelha++;
            }
            if(cell.style.border == Ocupada.NORMAL){
                preta++;
            }
            if(cell.style.border == Ocupada.PASSADA){
                azul++;
            }
        }
    }

    //Pega o numero de linhas e colunas e calcula o total de casas
    let linha = document.getElementById("linha").value;
    let coluna = document.getElementById("coluna").value;
    let totalCedulas = linha * coluna;

    //Estabelece quando perde o jogo e quando ganha o jogo
    if(preta > 1 && vermelha == 0){
        perdeuJogo();
    }
    else if(azul == (totalCedulas - 1)){
        venceuJogo();
    }    
}

//Muda a cor das casas que tem a possibilidade de receber jogadas
function mudaCor(row, cell){
    var celula = new Coordenada(row, cell);
    var corpo = document.querySelector("table");
    var corpoLin = corpo.rows;
    
    for(let i = 0; i < corpoLin.length; i++){
        let lin = corpoLin[i];
        for(let j = 0; j < lin.cells.length; j++){
            let mudar = lin.cells[j];
            if(possibilidades(celula,i,j) && mudar.style.border != Ocupada.PASSADA){
                mudar.style.border = Ocupada.POSSIBILIDADE;
            }
        }
    }
}

//Imprime na tela que ganhou o jogo
function venceuJogo(){
    var saida = document.querySelector("p");
    saida.innerHTML = "Fim de Jogo! Voce ganhou!";
    return 0;
}

//Imprime na tela que perdeu o jogo
function perdeuJogo(){
    if(contadorDeJogadas > 2){
        var saida = document.querySelector("p");
        saida.innerHTML = "Fim de Jogo! Voce perdeu!";
        return 0;
    }
}

//As possibilidades de jogada de um cavalo
function possibilidades(celula, i, j){
    //i-1 e j+2 = baixo esquerda
    if (i == (celula.x - 1) && j == (celula.y + 2)){
        return true;
    }
    //i-1 e j-2 = cima esquerda
    if (i == (celula.x - 1) && j == (celula.y - 2)){
        return true;
    }
    //i+1 e j+2 = baixo direita
    if (i == (celula.x + 1) && j == (celula.y + 2)){
        return true;
    }
    //i+1 e j-2 = cima direita
    if (i == (celula.x + 1) && j == (celula.y - 2)){
        return true;
    }
    //i-2 e j+1 = esquerda baixo
    if (i == (celula.x - 2) && j == (celula.y + 1)){
        return true;
    }
    //i-2 e j-1 = esquerda cima
    if (i == (celula.x - 2) && j == (celula.y - 1)){
        return true;
    }
    //i+2 e j+1 = direita baixo
    if (i == (celula.x + 2) && j == (celula.y + 1)){
        return true;
    }
    //i+2 e j-1 = direita cima
    if (i == (celula.x + 2) && j == (celula.y - 1)){
        return true;
    }
}

//Funcao chamada quando ocorre o click numa casa
function play(){

    //Primeira jogada no jogo, coloca o cavalo na casa e inicia o jogo
    if(contadorDeJogadas == 1){
        this.appendChild(cavalo);        
        atual = this;
        contadorDeJogadas++;
        jogoIniciado = true;
        jogada();
    }
    else{
        //Aceita somentes jogadas em casas nao passadas antes e que estao nas possibilidades de jogada do cavalo
        if(this.style.border != Ocupada.PASSADA && this.style.border == Ocupada.POSSIBILIDADE){
            this.appendChild(cavalo);
            atual.innerHTML = contadorDeJogadas - 1;
            atual.style.border = Ocupada.PASSADA;
            atual = this;
            contadorDeJogadas++;
            jogada();
        }
    }
}

//Utilizada apenas em mudar cor e possibilidades por falta de criatividade, cria um objeto que representa a localizacao com eixo xy
class Coordenada {
    constructor(row, col) {
        this.x = row;
        this.y = col;
    }
    equals(cell) {
        return (cell.x === this.x && cell.y === this.y);
    }
}

//Cria o objeto que sao constantes das possibilidades de colocaracao da borda
//Utilizado para colocar a cor nas casas e para comparacao de possibilidades de casa
const Ocupada = Object.freeze({
    POSSIBILIDADE: "3px solid red",
    PASSADA: "3px solid blue",
    NORMAL: "3px solid black"
});

//Local de inicio do codigo quando a pagina eh carregada
window.onload = criarJogo;