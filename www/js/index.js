fetch('js/backend.json').then(response => response.json())
    .then(data => {
        localStorage.setItem('products', JSON.stringify(data));
        console.log('Product data stored in localStorage');

        setTimeout(() => { 
            $("#products").empty();

            data.forEach(product => {
                var productHTML = `
                <div class="item-card">
                    <a data-id="${product.id}" href="#" class="item">
                        <div class="img-container">
                            <img src="${product.imagem}" alt="AirPod Image">
                        </div>
                        <div class="name-rating">
                            <span class="item-name">${product.nome}</span>
                            <span class="bold margin-right">
                                <i class="mdi mdi-star"></i>
                                ${product.rating}
                            </span>
                        </div>
                        <div class="price bold">${product.preco_promocional.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</div>
                    </a>
                </div>
                `;

                $("#products").append(productHTML);
            });

            $(".item").on('click', function() {
                var id = $(this).attr('data-id');
                localStorage.setItem('detail', id);
                app.views.main.router.navigate('/details/');
            });
        }, 2000);
    })
    .catch(error => console.error('Data fetch error: ' + error));

setTimeout(() => {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];

    $(".btn-cart").attr('data-count', cart.length);    

}, 300);