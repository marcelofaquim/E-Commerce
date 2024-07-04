fetch('js/backend.json') // Ligação da pagina com a url ou o arquivo
.then(response => response.json()) // oque vai rolar se der certo
.then(data=>{
    //Salvar os dados vindo do Backend localmente, vamos utilizar um localstorage
    localStorage.setItem('produtos', JSON.stringify(data));
    console.log('Dados do produtos salvos no localStorage');

    //temporizador para testarmos o efeito do skeleton, simulador de carregamento
     setTimeout(() =>{

    //esvaziar a area de produtos
    $("#produtos").empty();

    data.forEach(produto =>{
        var produtoHTML= `
            <div class="item-card">

                                    <a data-id="${produto.id}" href="#" class="item">

                                        <div class="img-container">
                                            <img src="${produto.imagem}">
                                        </div>

                                        <div class="nome-rating">
                                            <span class="color-gray">${produto.nome}</span>
                                            <span class="bold margin-right">
                                                <i class="mdi mdi-star"></i>
                                                ${produto.rating}
                                            </span>
                                        </div>

                                        <div class="prince">${produto.preco_promocional.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})} </div>
                                    </a>
                                </div>
        `;

        $("#produtos").append(produtoHTML);
    });

    //Disparo de evento que após clicar no item iremos para a pagina de detalhes
    $(".item").on('click', function() {
        var id = $(this).attr('data-id');
        localStorage.setItem('detalhe', id);
        app.views.main.router.navigate('/detalhes/');
    });

    }, 1000);
    

}) // oque vai dar receber
.catch(error => console.error('Erro ao fazer o fetch dos dados: '+error)) //erro


//VER QUANTOS ITENS TEM DENTRO DO CARRINHO

setTimeout(() => {
    var carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    //ALIMENTAR O CONTADOR DA SACOLA
    $('.btn-cart').attr('data-count', carrinho.length);

}, 300);

