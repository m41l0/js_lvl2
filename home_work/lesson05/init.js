//создаем экземпляр класса
$(document).ready(function () {
    var basket = new Basket();

    basket.render('#basket_wrapper');

    $('.buyme').on('click', function () {
        var idProduct = parseInt($(this).attr('id').split('_')[1]);
        var quantity = 1;
        var price = parseInt($(this).parent().find('.product-price').text());

        basket.add(idProduct, quantity, price);
    });
});
