function Basket() {
    Container.call(this, 'basket'); //'basket' - передаем id

    this.quantityGoods = 0; //кол-во товара
    this.totalPrice = 0; //общая цена

    this.basketItems = []; //хранит товары, которые добавляем

    //вызываем метод для подгрузки корзины
    this.collectBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function (rootElement) {//передаем корневой элемент, для вставки
    //создаем вспомогательный div
    var basketDiv = $('<div />', {
        id: this.id,
        text: 'Корзина'
    });

    var basketItemsDiv = $('<div />', {
        id: this.id + '_items'
    });

    basketItemsDiv.appendTo(basketDiv);
    basketDiv.appendTo(rootElement);
};

//получение элементов корзины, вызывается, при создании корзины на странице
Basket.prototype.collectBasketItems = function () {
    var appendId = '#' + this.id + '_items'; //определяем id товара
    // var self = this;
    $.get({
        url: './basket.json',
        success: function (data) { //вызывается, при успешном ответе
            //создаем новый элемент
            var basketData = $('<div />', {
                id: 'basket_data'
            });

            //меняем кол-во товара
            this.quantityGoods = data.basket.length;
            // self.quantityGoods = data.basket.length;
            this.totalPrice = data.totalPrice;

            basketData.append('<p>Всего товаров: ' + this.quantityGoods + '</p>');
            basketData.append('<p>Сумма товаров: ' + this.totalPrice + '</p>');

            basketData.appendTo(appendId);

            for (var item in data.basket) {
                this.basketItems.push(data.basket[item]);
            }
        },
        context: this,
        dataType: 'json'
    });
};

//метод для добавления новго элемента в корзину
Basket.prototype.add = function (idProduct, quantity, price) {
    var basketItem = {
        "id_Product": idProduct,
        "price": price
    };

    //TODO: передача нового товара на сервер

    //счетчик кол-ва товаров
    for (var i = 1; i <= quantity; i++) {
        this.quantityGoods++;
    }

    this.totalPrice += price * quantity; //вычисление стоимости
    this.basketItems.push(basketItem); //добавление элемента в массив

    ////////////////////////////////////////////////////////
    var productDiv = $('#basket_items'); //вспомогательная переменная для блока, куда будем вставлять купленные товары

    var btn_drop = $('<a />', { // "кнопочка" для удаления элемента
        href: '#',
        id: 'btn_drop' + idProduct,
        text: '[х]'
    });
    //копируем элемент с товаром и убираем атрибут 'id'
    var productItem = $('#product_' + basketItem.id_Product).clone().removeAttr('id');

    btn_drop.appendTo(productItem); // вставляем "кнопочку-удалялку" в элемент с товаром

    productItem.appendTo(productDiv);
    ////////////////////////////////////////////////////////

    this.refresh();

    $('#btn_drop' + idProduct).on('click', function () {
        Basket.prototype.drop(idProduct);
    });
};

//TODO: метод для удаления товара из корзины
Basket.prototype.drop = function (idProduct) {
    // console.log('OK');
    $('#btn_drop' + idProduct).parent().remove();
};

//метод для обновление информации на странице
Basket.prototype.refresh = function () {
    var basketDataDiv = $('#basket_data');
    basketDataDiv.empty(); //очищаем содержимое
    basketDataDiv.append('<p>Всего товаров: ' + this.quantityGoods + '</p>');
    basketDataDiv.append('<p>Сумма товаров: ' + this.totalPrice + '</p>');
};