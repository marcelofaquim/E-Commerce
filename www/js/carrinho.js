//Arquivo responsavél pela logica da parte do carrinho

//Recuperar os dados do localStorage

var localCarrinho = localStorage.getItem('carrinho');

if(localCarrinho) {
    var carrinho = JSON.parse(localCarrinho);
    if(carrinho.length > 0){
        //Tem itens no carrinho, atualizar carrinho e somar os totais
        
        //ATUALIZAR CARRINHO
        renderizarCarrinho();

        //SOMAR OS TOTAIS DOS PRODUTOS
        calcularTotal();

    }else{
        //Mostrar o carrinho vazio
        carrinhoVazio();
    }

}else{
    //Mostrar o carrinho vazio
    carrinhoVazio();
}

function renderizarCarrinho(){

    //esvaziar o carrinho
    $("#listaCarrinho").empty();

    //PERCORRER O CARRINHO E ALIMENTAR COM OS PRODUTOS
    $.each(carrinho, function(index, itemCarrinho){
        var itemDiv = `
            <div class="item-carrinho">
                            <div class="area-img">
                                <img src="${itemCarrinho.item.imagem}">
                            </div>
                            <div class="area-details">
                                <div class="sup">
                                    <span class="name-prod">
                                       ${itemCarrinho.item.nome}                            
                                    </span>
                                    <a  data-index="${index}" class="delete-item" href="#">
                                        <i class="mdi mdi-close"></i>
                                    </a>
                                </div>
                                <div class="middle">
                                    <span> ${itemCarrinho.item.principal_caracteristica}</span>
                                </div>
                                <div class="preco-quantidade">
                                    <span> ${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</span>
                                    <div class="count">
                                        <a class="minus" data-index="${index}" href="#">-</a>
                                        <input readonly class="qtd-item" type="text" value="${itemCarrinho.quantidade}">
                                        <a class="plus" data-index="${index}" href="#">+</a>
                                    </div>
                                </div>
                            </div>
                        </div>
        
        `;

        $("#listaCarrinho").append(itemDiv);
    });

    //REMOVER ITEM PELO  BOTÃO "X"

$(".delete-item").on('click', function() {
    var index = $(this).data('index');

    //CONFIRMAR EXCLUSÃO
    app.dialog.confirm('Tem certeza que deseja remover este produto?','Remover', function(){
        
        //REMOVER O ITEM DO CARRINHO
        carrinho.splice(index, 1);

        //ATUALIZAR O CARRINHO COM O ITEM REMOVIDO
        localStorage.setItem('carrinho', JSON.stringify(carrinho))
   
        //atualizar a pagina
        app.views.main.router.refreshPage();
    });

});

//BOTÃO - TER FUNCIONALIDADE

$(".minus").on('click', function() {
    var index = $(this).data('index');

    if(carrinho[index].quantidade >1){
        carrinho[index].quantidade--;
        carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        app.views.main.router.refreshPage();
    
    }else{
        var itemName = carrinho[index].item.nome;
            app.dialog.confirm(`Gostaria de remover <strong>${itemName}</strong>?`, 'REMOVER', function(){
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                calcularTotal();
            });
    }

    
});

//BOTÃO + TER FUNCIONALIDADE

$(".plus").on('click', function() {
    var index = $(this).data('index');

    carrinho[index].quantidade++;
    carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
    calcularTotal(); 

    });

}

function calcularTotal() {
    var totalCarrinho = 0;
    
    $.each(carrinho, function(index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });

    //MOSTRAR O TOTAL
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'}));
}

//Esvaziar o carrinho

function carrinhoVazio(){
    console.log('Carrinho esta vazio');

    $("#listaCarrinho").empty();

    //sumir os valores 
    $("#toolbarTotais").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    //mostrar sacola vazio gif
  $("#listaCarrinho").html(`
      <div class="text-align-center">
         <img width="300" src="img/empty.gif">
         <br><span class="color-gray"> Nada adicionado na sacola...</span>
      </div>   
        
         `);
 
}

$("#esvaziar").on('click', function(){
    app.dialog.confirm('Tem certeza que deseja esvaziar o carrinho?', '<strong> ESVAZIAR </strong>', function(){
        //APAGAR O LOCALSTORAGE DO CARRINHO
        localStorage.removeItem('carrinho');
        app.views.main.router.refreshPage();
    });
})


