function Container(id) {
    this.id = id;
    this.className = '';
    this.htmlCode = '';
}

Container.prototype.render = function () {
    return this.htmlCode;
};

function Basket() {
    Container.call(this, 'basket');

    this.countGoods = 0;//количество товаров
    this.amount = 0;//сумма всех товаров

    this.basketItems = [];//массив с данными товаров
    this.collectBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function (root) {
    var basketDiv = $('<div />', {
        id: this.id,
        html: '<h4>Корзина</h4>'
    });

    var basketItemsDiv = $('<div />', {
        id: this.id + '_items'
    });

    basketItemsDiv.appendTo(basketDiv);
    basketDiv.appendTo(root);
};

/*----------------- Задание 1 ----------------------------------------------------------------------------*/

//создаётся строчка таблицы для отображения товара в корзине, передаётся объект в формате json-данных из файла
Basket.prototype.createItem = function (item) {
    var tr, td, a, span;

    tr = document.createElement('tr');
    //ячейка с идентификатором
    td = document.createElement('td');
    td.innerHTML = item.id_product;
    tr.appendChild(td);
    //ячейка цены
    td = document.createElement('td');
    td.innerHTML = item.price;
    tr.appendChild(td);
    //ячейка с количством и кнопками управления
    td = document.createElement('td');
    //кнопка уменьшения количества товара
    a = document.createElement('a');
    a.href = '#';
    a.innerHTML = '-';
    td.appendChild(a);
    $(a).data('productId',item.id_product).click(this, function (event) {
        //запускается функция обновления товара
        event.data.updateItem(
            $(event.currentTarget).data('productId'),//идентификатор продукта из data
            -1,//количество для уменьшения
            event.currentTarget.nextSibling//следующий элемент после кнопки
        );
        event.preventDefault();
    });
    //элемент вывода количества
    span = document.createElement('span');
    span.id = 'cnt_' + item.id_product;
    span.innerHTML = item.count;
    td.appendChild(span);
    //кнопка увеличения количества товара
    a = document.createElement('a');
    a.href = '#';
    a.innerHTML = '+';
    td.appendChild(a);
    $(a).data('productId',item.id_product).click(this, function (event) {
        event.data.updateItem(
            $(event.currentTarget).data('productId'),
            1,
            event.currentTarget.previousSibling
        );
        event.preventDefault();
    });

    tr.appendChild(td);
    //ячейка для кнопки удаления товара
    td = document.createElement('td');
    a = document.createElement('a');
    a.href = '#';
    a.innerHTML = 'удалить';
    td.appendChild(a);
    $(a).data('productId',item.id_product).click(this, function (event) {
        event.data.deleteItem(
            $(event.currentTarget).data('productId'),
            event.currentTarget.parentNode.parentNode//tr - родитель родителя
        );
        event.preventDefault();
    });
    tr.appendChild(td);

    return tr;
}

//функция получения индекса товара в корзине - для обновления и удаления
Basket.prototype.getBasketItemIndex = function (key, value) {

    var i = 0;
    while (i < this.basketItems.length && this.basketItems[i][key] !== value) {
        i++;
    }
    if(i === this.basketItems.length){
        return -1;
    } else {
        return i;
    }

}

//пересчёт суммарных данных по товарам (количество, цена)
Basket.prototype.recountSummary = function (num, price) {
    this.countGoods += num;//количество может быть и отрицательным
    this.amount += num * price;
}

//удаление продукта из корзины, container - dom-элемент продукта в корзине
Basket.prototype.deleteItem = function (id, container) {
    var currentIndex = this.getBasketItemIndex('id_product', id);
    var item = this.basketItems[currentIndex];
    this.recountSummary(-item.count, item.price);//пересчитываются общие данные
    this.basketItems.splice(currentIndex, 1);//удаляется продукт из массива
    $(container).remove();//удаляется контейнер
    $('#summary-data').empty().append(this.renderSummary());//обновляется вывод суммарных данных
}

//обновления данных о товаре в корзине, идентификатор, значение, на которое изменяется, dom-элемент для вывода
Basket.prototype.updateItem = function (id, value, outputElement) {
    var currentIndex = this.getBasketItemIndex('id_product', id);
    if(this.basketItems[currentIndex].count+value > 0){//если больше 0 при уменьшении
        this.basketItems[currentIndex].count += value;
        this.recountSummary(value, this.basketItems[currentIndex].price);
        $(outputElement).text(this.basketItems[currentIndex].count);
        $('#summary-data').empty().append(this.renderSummary());
    }
}

//добавления продукта
Basket.prototype.addItem = function (id, price) {
    var currentIndex = this.getBasketItemIndex('id_product', id);
    if(currentIndex >= 0){//если продукт уже в корзине - просто обновляется функцией
        var outputElement = document.getElementById('cnt_' + id);//по Id получает элемент для вывода данных
        this.updateItem(this.basketItems[currentIndex].id_product, 1, outputElement);
    } else {//если продукт не в корзине
        var item = {id_product: id, price: price, count: 1};
        this.basketItems.push(item);//добавляется в массив
        $('#items-list').append(this.createItem(item));//добавляется в блок с корзиной
        this.recountSummary(1, item.price);
        $('#summary-data').empty().append(this.renderSummary());
    }
}

//вывод суммарных данных о продуктах
Basket.prototype.renderSummary = function () {
    return '<p>Всего товаров: ' + this.countGoods + '</p><p>Сумма: ' + this.amount + '</p>';
}

Basket.prototype.collectBasketItems = function () {
    var appendId = '#' + this.id + '_items';
    $.get({
        url: 'basket.json',
        success: function (data) {
            var basketData = $('<div />', {
                id: 'basket_data'
            });

            this.amount = data.amount;

            var itemsList = document.createElement('table');
            itemsList.id = 'items-list';
            //шапка таблицы
            var tr = document.createElement('tr');

            var th = document.createElement('th');
            th.innerHTML = 'ID';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerHTML = 'цена';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerHTML = 'кол-во';
            tr.appendChild(th);

            itemsList.appendChild(tr);

            for(var i=0; i<data.basket.length; i++)
            {
                this.countGoods += data.basket[i].count;
                this.basketItems.push(data.basket[i]);
                itemsList.appendChild(this.createItem(data.basket[i]));
            }

            basketData.append(itemsList);
            basketData.append($('<div />', {
                id: 'summary-data'
            }).append(this.renderSummary()));
            basketData.appendTo(appendId);
        },
        context: this,
        dataType: 'json'
    });
};


/*----------------- Задание 2 ----------------------------------------------------------------------------*/

//класс для работы с обзорами
function ProductReview(productId){
    this.productId = productId;//идентификатор продукта, с обзорами которого работает
    this.newId = 100;//переменная для генератора id, т.к. без серверной части
};

//генератор id
ProductReview.prototype.getNewId = function () {
    return this.productId + (this.newId++);
};

//вывод ошибок, передаётся объект с полями result и error_message
ProductReview.prototype.showError = function (data) {
    alert('Что-то пошло не так: ' + data.error_message);
};

//общий метод ajax-запроса, передаются имя файла, функция обработки результатов и массив $данных для отправки (если есть)
ProductReview.prototype.sendRequest = function (fileName, handler, post) {
    post ? (method = 'POST') : (method = 'GET');
    $.ajax({
        url: './json/review.' + fileName + '.json',
        type: method,
        data: post,
        dataType: 'Json',
        success: function(data){
            handler.call(this, data);
        },
        context: this,
        error: function(xhr, status) {
            alert('Ошибка AJAX: ' + status);
        }
    });
};

//возвращает сформированный html комментарий, с кнопками и пр., передаётся объект из json-списка обзоров
ProductReview.prototype.renderComment = function (commentData) {

    var li, p, a, strong;

    li = document.createElement('li');

    //данные пользователя
    strong = document.createElement('strong');
    strong.innerHTML = 'Пользователь ' + commentData.id_user;
    li.appendChild(strong);

    //текст обзора
    p = document.createElement('p');
    p.appendChild(document.createTextNode(commentData.text));//что бы всё выводилось именно как текст
    li.appendChild(p);

    //кнопка одобрения комментария
    a = document.createElement('a');
    a.href = '#';
    a.innerHTML = 'одобрить';
    li.appendChild(a);
    a = $(a);
    a.data('reviewId', commentData.id_comment);//к элементу добавляются данные об идентификаторе
    a.click(this, function(event){
        var $currentTarget = $(event.currentTarget);
        //можно передать только $currentTarget, но логичнее требуемые данные отдельно, элемент интерфейса отдельно?
        event.data.submit($currentTarget.data('reviewId'), $currentTarget);
        event.preventDefault();
    });

    //кнопка удаления комментария
    a = document.createElement('a');
    a.href = '#';
    a.innerHTML = 'удалить';
    li.appendChild(a);
    a = $(a);
    a.data('reviewId', commentData.id_comment);
    a.click(this, function(event){
        //передаётся родитель кнопки - контейнер с комментарием
        event.data.delete($(event.currentTarget).data('reviewId'), $(event.currentTarget.parentNode));
        event.preventDefault();
    });

    return li;
}

//добавление комментария, передаётся dom-форма и dom-элемент для вывода
ProductReview.prototype.add = function (form, outputBox) {
    if(form.reviewText.value.length > 2){//не пустое поле комментария
        var formData = $(form).serializeArray();//получает данные из формы в виде массива объектов
        this.sendRequest('add', function(data){
            if(data.result === 1){
                //если с серверной частью, то загружается по id новый комментарий, т.к. нет - эмуляция
                var comment = {
                    "id_comment": this.getNewId()
                };
                for(var i=0; i<formData.length; i++){
                    switch (formData[i].name) {
                        case 'userId':
                            comment.id_user = formData[i].value;
                            break;
                        case 'reviewText':
                            comment.text = formData[i].value;
                            break;
                    }
                }
                outputBox.appendChild(this.renderComment(comment));
                form.reviewText.value = '';
            } else if(data.result === 0){
                this.showError(data);
            }
        },
        formData);//сериализованные jquery данные формы для записи в базу
    } else {
        alert('В комментарии должно быть не меньше 3 символов');
    }

};

//одобряет комментарий из базы по идентификатору, удаляет кнопку если удачно
ProductReview.prototype.submit = function (reviewId, $button) {
    this.sendRequest('submit', function(data){//можно добавить .error к имени файла для проверки обработки ошибок
        if(data.result === 1){
            $button.remove();
        } else if(data.result === 0){
            this.showError(data);
        }
    },
    {"id_comment": reviewId});//передаются данные для обновления базы
};

//удаляет комментарий из базы по идентификатору, удаляет контейнер с комментарием
ProductReview.prototype.delete = function (reviewId, $commentBox) {
    this.sendRequest('delete', function(data){
        if(data.result === 1){
            $commentBox.remove();
        } else if(data.result === 0){
            this.showError(data);
        }
    },
    {"id_comment": reviewId});
};

//вывод списка комментариев-обзоров, передаётся контейнер для вывода (dom-элемент)
ProductReview.prototype.list = function (htmlContainer) {
    this.sendRequest(
        'list.' + this.productId,
        function (data) {
            if(data.result === 0){
                this.showError(data);
            } else {
                htmlContainer.innerHTML = '';
                for(var i=0; i<data[0].comments.length; i++){
                    htmlContainer.appendChild(this.renderComment(data[0].comments[i]));
                }
            }
        }
    )
};



window.onload = function () {

}



$(document).ready(function () {
    var reviews = new ProductReview('123');
    reviews.list(document.getElementById('review-list_123'));

    $('#review_123>button').click(function(event){
        reviews.add(document.getElementById('review_123'), document.getElementById('review-list_123'));
        event.preventDefault();
    });


    var basket = new Basket();
    basket.render('#basket_wrapper');

    $('.buyme').on('click', function () {
        basket.addItem($(this).data('productid'), $(this).data('price'));
    });
});
