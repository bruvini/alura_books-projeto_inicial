let livros = []
const endPointAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
getBuscaLivroAPI()
const elementoLivros = document.getElementById('livros')
const elementoValorTotal = document.getElementById('valor_total_livros_disponiveis')

/**CONEXÃO COM API */
async function getBuscaLivroAPI() {
    const res = await fetch(endPointAPI)
    livros = await res.json()
    let livrosComDesconto = aplicarDesconto(livros)
    exibeLivros(livrosComDesconto)
}

/**AULA - MÉTODO FOREACH */
function exibeLivros(listaDeLivros) {
    elementoLivros.innerHTML = ''
    elementoValorTotal.innerHTML = ''
    listaDeLivros.forEach(livro => {
        let disponibilidade = verificaDisponibilidade(livro)

        elementoLivros.innerHTML += `
            <div class="livro">
            <img class="${disponibilidade}" src="${livro['imagem']}" alt="${livro['alt']}" />
            <h2 class="livro__titulo">
                ${livro['titulo']}
            </h2>
            <p class="livro__descricao">${livro['autor']}</p>
            <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
            <div class="tags">
            <span class="tag">${livro['categoria']}</span>
            </div>
            </div>
        `
    });
}

/**AULA - MÉTODO MAP */
 function aplicarDesconto(livros) {
    const valorDesconto = 0.3
    livrosComDesconto = livros.map(livro => {
        return {...livro, preco: livro.preco - (livro.preco * valorDesconto)}
    })
    return livrosComDesconto
 }

 /**AULA - MÉTODO FILTER */
const botoes = document.querySelectorAll('.btn')
botoes.forEach(btn => btn.addEventListener("click", filtrarLivros));

 function filtrarLivros() {
    const elementoBtn = document.getElementById(this.id)
    const cat = elementoBtn.value
    let livrosFiltrados = cat == 'disponivel' ? filtrarPorDisponibilidade() : filtrarPorCategoria(cat)
    exibeLivros(livrosFiltrados)
    if (cat == 'disponivel') {
        const valorTotal = calcularTotal(livrosFiltrados)
        exibeValorTotal(valorTotal)
    }
 }

function filtrarPorCategoria(cat) {
    return livros.filter(livro => livro.categoria == cat)
}

function filtrarPorDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0)
}

 function exibeValorTotal(valorTotal) {
    elementoValorTotal.innerHTML = `
        <div class="livros__disponiveis">
            <p>Todos os livros disponíveis por R$ <span id="valor">R$${valorTotal}</span></p>
        </div>
    `
 }

 /**AULA - MÉTODO SORT */
 let btnPreco = document.getElementById('btnOrdenarPorPreco')

 btnPreco.addEventListener("click", ordenarPorPreco)
 function ordenarPorPreco() {
    let ordenados = livros.sort((a, b) => a.preco - b.preco)
    exibeLivros(ordenados)
 }

 function verificaDisponibilidade(livro) {
     if (livro.quantidade > 0) {
        return 'livro__imagens'
     }else {    
        return 'livro__imagens indisponivel'
     }
 }

 /**AULA - MÉTODO REDUCE */
function calcularTotal(livros) {
    return livros.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2)
}