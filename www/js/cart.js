var localCart = localStorage.getItem('cart');

function emptyCart() {
    console.log('Cart is empty');

    $("#cartList").empty();

    $("#toolbarTotals").addClass('display-none');
    $("#toolbarCheckout").addClass('display-none');

    $("#cartList").html(`
        <div class="text-align-center">
            <img width="300" src="./img/empty.gif">
            <br><span style="color: gray;">Your cart is empty.</span>
        </div>
    `);
}

function loadCart() {
    $("#cartList").empty();

    $.each(cart, function(index, itemCart) {
        var itemDiv = `
        <div class="cart-item">
            <div class="item-img">
                <img src="${itemCart.item.imagem}" alt="Item Image">
            </div>
            <div class="item-details">
                <div class="item-name">
                    <span class="product-name">${itemCart.item.nome}</span>
                    <a class="item-delete" data-index="${index}" href="#"><i class="mdi mdi-close"></i></a>
                </div>
                <div class="item-info">
                    <span>${itemCart.item.principal_caracteristica}</span>
                </div>
                <div class="price-quantity">
                    <span>${itemCart.item.preco_promocional.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</span>
                    <div class="count">
                        <a class="minus" data-index="${index}" href="#">-</a>
                        <input class="item-quantity" type="text" readonly value="${itemCart.quantity}">
                        <a class="plus" data-index="${index}" href="#">+</a>
                    </div>
                </div>
            </div>
        </div>
        `
        $("#cartList").append(itemDiv);
    });

    $(".item-delete").on('click', function() {
        var index = $(this).data('index');
        var itemName = cart[index].item.nome;
        
        app.dialog.confirm(`Are you sure you want to remove <strong>${itemName}</strong> from your cart?`, 'Remove Product', function() {
            cart.splice(index, 1);
            // Atualiza o carrinho após remover item
            localStorage.setItem('cart', JSON.stringify(cart));
            app.views.main.router.refreshPage();
        });
    });

    $(".minus").on('click', function() {
        var index = $(this).data('index');
        
        if(cart[index].quantity > 1) {
            cart[index].quantity--;
            cart[index].total = cart[index].quantity * cart[index].item.preco_promocional;

            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            calcTotal();
        } else {
            var itemName = cart[index].item.nome;

            app.dialog.confirm(`Are you sure you want to remove <strong>${itemName}</strong> from your cart?`, 'Remove Product', function() {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                loadCart();
                calcTotal();
            });
        }
    });

    $(".plus").on('click', function() {
        var index = $(this).data('index');
        
        cart[index].quantity++;
        cart[index].total = cart[index].quantity * cart[index].item.preco_promocional;

        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
        calcTotal();
    });
}

function calcTotal() {
    var totalCart = 0;

    $.each(cart, function(index, itemCart) {
        totalCart += itemCart.total;
    });

    $("#subtotal").html(totalCart.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
}

if(localCart) {
    var cart = JSON.parse(localCart);

    if(cart.length > 0) {

        // Carregar itens do carrinho
        loadCart();

        // Somar o valor total da compra
        calcTotal();

    } else {
        // Limpar carrinho
        emptyCart();
    }

} else {
    emptyCart();
}

$("#emptyShopCart").on('click', function() {
    app.dialog.confirm(`Are you sure you want to remove <strong>all products</strong> from your cart?`, 'Empty Cart', function() {
        localStorage.removeItem('cart');
        app.views.main.router.refreshPage();
    });
});