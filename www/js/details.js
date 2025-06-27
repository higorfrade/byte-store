var id = parseInt(localStorage.getItem('detail'));
var products = JSON.parse(localStorage.getItem('products'));
var item = products.find(product => product.id === id);
var cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(item, quantity) {
    var cartItem = cart.find(c => c.item.id === item.id);

    if(cartItem) {
        cartItem.quantity += quantity;
        cartItem.total = cartItem.quantity * item.preco_promocional;
    } else {
        cart.push({
            item: item,
            quantity: quantity,
            total: quantity * item.preco_promocional
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

if(item) {
    console.log('Product found: ', item);

    $("#imageDetail").attr('src', item.imagem);
    $("#productName").html(item.nome);
    $("#productRating").html(item.rating);
    $("#productLikes").html(item.likes);
    $("#productReviews").html(item.reviews + ' reviews');
    $("#productDescription").html(item.descricao);
    $("#productPrice").html(item.preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));
    $("#productSalePrice").html(item.preco_promocional.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}));

    var detailsTable = $("#detailsTable");

    item.detalhes.forEach(detail => {
        var line = `
        <tr>
            <td>${detail.caracteristica}</td>
            <td>${detail.detalhes}</td>
        </tr>
        `;

        detailsTable.append(line);
    });

} else {
    console.log('Product not found')
}

$(".add-cart").on('click', function() {
    addToCart(item, 1);

    var toastCenter = app.toast.create({
        text: `${item.nome} added to cart.`,
        position: 'center',
        closeTimeout: 2000,
    });

    toastCenter.open();
});