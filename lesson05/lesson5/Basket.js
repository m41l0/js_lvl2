function Basket() {
    Container.call(this, 'basket');

    this.countGoods = 0;
    this.amount = 0;

    this.basketItems = [];
    this.collectBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function (root) {
    var basketDiv = $('<div />', {
        id: this.id,
        text: 'Корзина'
    });

    var basketItemsDiv = $('<div />', {
        id: this.id + '_items'
    });

    basketItemsDiv.appendTo(basketDiv);
    basketDiv.appendTo(root);
};

Basket.prototype.collectBasketItems = function () {
    var appendId = '#' + this.id + '_items';
    //var self = this;
    $.get({
        url: 'basket.json',
        success: function (data) {
            var basketData = $('<div />', {
                id: 'basket_data'
            });

            this.countGoods = data.basket.length;
            this.amount = data.amount;

            basketData.append('<p>Всего товаров: ' + this.countGoods + '</p>');
            basketData.append('<p>Сумма: ' + this.amount + '</p>');

            basketData.appendTo(appendId);

            for(var item in data.basket)
            {
                this.basketItems.push(data.basket[item]);
            }
        },
        context: this,
        dataType: 'json'
    });
};

Basket.prototype.add = function (idProduct, quantity, price) {
  var basketItem = {
      "id_product": idProduct,
      "price": price
  };

  //TODO: Передача нового товара на сервер

  for (var i = 1; i <= quantity; i++)
  {
      this.countGoods++;
  }

  this.amount += price * quantity;
  this.basketItems.push(basketItem);
  this.refresh();
};

Basket.prototype.refresh = function () {
    var basketDataDiv = $('#basket_data');
    basketDataDiv.empty();
    basketDataDiv.append('<p>Всего товаров: ' + this.countGoods + ' </p>');
    basketDataDiv.append('<p>Сумма: ' + this.amount + ' </p>');
};