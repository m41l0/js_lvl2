function Container() {
    this.className = '';
    this.htmlElement = null;
}

//для каждого свой метод, создает html-элемент, сохраняем в this.htmlElement
Container.prototype.create = function () {
    //todo можно удалить, закоментил пока
    // if (this.htmlElement === null) {
    // }
};

//выводим созданный элемент меню в элемент на странице
Container.prototype.render = function (parElement) { //todo лучше назвать не render, а addParentElement
    this.create();
    if (this.htmlElement) {
        parElement.appendChild(this.htmlElement);
    }
};

//основное меню
function Menu(menuId, myClass) {
    Container.call(this);
    menuId = menuId || 0;
    this.id = menuId; //индентификатор для загрузки из json-файла
    this.className = myClass;
    this.xhr = new XMLHttpRequest(); //todo обычно это делают в какой-то функции и возвращают результат,
}                                    // потомучто сам запрос не нужен, нужны те данные, которые он вернет

Menu.prototype = Object.create(Container.prototype);
Menu.prototype.constructor = Menu;

//удаляется элемент, созданный this.create
Menu.prototype.remove = function () {
    if (this.htmlElement) {
        this.htmlElement.parentNode.removeChild(this.htmlElement);
        this.htmlElement = null;
    } else {
        console.log('Нечего удалять');
    }
};

//загрузка json-элементов по пути
Menu.prototype.load = function () {
    this.xhr.open('GET', './json/menu' + this.id + '.json', true);
    this.xhr.send();
};

//создаем элементы для вставки на страницу
Menu.prototype.create = function () {
    if (this.htmlElement === null) {
        var menuItems; //список пунктов меню
        var ul = document.createElement('ul'); //контейнер для пунктов
        ul.className = this.className;
        this.htmlElement = ul; //сразу создаем ссылку на элемент

        //после получения json данных отрисовываем
        this.xhr.onreadystatechange = function () {
            if (this.readyState != 4)
                return;
            if (this.status != 200) {
                console.log('Error', xhr.status, xhr.statusText);
            } else {
                menuItems = JSON.parse(this.responseText);
                if (menuItems) {
                    for (var i = 0; i < menuItems.length; i++) {
                        if (menuItems[i].id) { //если это подменю, создаем соответствующий объект
                            var item = new MenuSub(menuItems[i].id, 'sub-menu', menuItems[i].href, menuItems[i].title);
                        } else { //если это обычный пункт
                            item = new MenuItem(menuItems[i].href, menuItems[i].title);
                        }
                        item.render(ul);//отрисовываем всё в контейнере
                    }
                }
            }
        };

        this.load(); //отрисовываем запрос
    }
};

function MenuItem(myHref, myTitle) {
    Container.call(this);
    this.className = 'menu-item';
    this.href = myHref;
    this.title = myTitle;
}

MenuItem.prototype = Object.create(Container.prototype);
MenuItem.prototype.constructor = MenuItem;

MenuItem.prototype.create = function () {
    if (this.htmlElement === null) {
        var li = document.createElement('li');
        var a = document.createElement('a');

        li.className = this.className;
        a.href = this.href;
        a.innerHTML = this.title;
        li.appendChild(a);
        this.htmlElement = li;
    }
};

//вложенное меню, с методами и параметрами Menu и параметрами MenuItem
function MenuSub(menuId, myClass, myHref, myTitle) {
    MenuItem.call(this);
    Menu.call(this);
    menuId = menuId || 0;
    this.className = 'menu-item';
    this.href = myHref;
    this.title = myTitle;
    this.id = menuId; //идентификатор для загрузки из json-файла
    this.className = myClass;
}

MenuSub.prototype = Object.create(Menu.prototype);
MenuSub.prototype.constructor = MenuSub;

MenuSub.prototype.create = function () {
    var li;
    if (this.htmlElement === null) { //если еще не создавался пункт подменю
        li = document.createElement('li');
        var a = document.createElement('a');
        a.href = this.href;
        a.innerHTML = this.title;
        li.appendChild(a);
    } else { //иначе всё добавляем в существующий
        li = this.htmlElement;
    }

    if (li.children.length === 1) { //если подпунктов еще нет
        var menuItems;
        var ul = document.createElement('ul');
        li.appendChild(ul); //основной контейнер сам должен быть в li

        ul.className = this.className;
        this.htmlElement = li;

        this.xhr.onreadystatechange = function () {
            if (this.readyState != 4)
                return;
            if (this.status != 200) {
                console.log('Error', xhr.status, xhr.statusText);
            } else {
                menuItems = JSON.parse(this.responseText);
                if (menuItems) {
                    for (var i = 0; i < menuItems.length; i++) {
                        if(menuItems[i].id) {
                            var item = new MenuSub(menuItems[i].id, 'sub-menu', menuItems[i].href, menuItems[i].title);
                        } else {
                            item = new MenuItem(menuItems[i].href, menuItems[i].title);
                        }
                        item.render(ul); //загружаем всё в основной контейнер
                    }
                }
            }
        };
        this.load();
    }
};

//удалять нужно только список в подменю, поэтому специальный метод
MenuSub.prototype.remove = function () {
    if (this.htmlElement.children.length > 1) { //удаляем только если есть список подпунктов
        this.htmlElement.removeChild(this.htmlElement.lastChild); //удаляем последний
    } else {
        console.log('Нечего удалять');
    }
};


window.onload = function () {
    //загружаем меню
    document.getElementById('btn').addEventListener('click', function () {
        var menuBox = document.getElementById('menu');
        var menu = new Menu(0, 'root-menu');
        menuBox.innerHTML = '';
        menu.render(menuBox);
    });
    //загружаем галерею
    document.getElementById('btn2').addEventListener('click', function () {
        var xhr = new XMLHttpRequest();
        var images = []; //массив для добавления данных об изображениях
        var path = './images/'; //путь к изображениям
        var gallery = document.getElementById('gallery');
        var a, img;

        //показать оригинальное изображение
        function showOriginal(path) {
            var div = document.getElementById('original-box');
            div.style.display = 'block';
            div.style.height = document.documentElement.clientHeight + 'px';
            div.style.backgroundImage = "url('" + path + "')";
            div.addEventListener('click', function (evt) {
                closeOriginal(evt);
            });
        }

        //убрать оригинальное изображение
        function closeOriginal(evt) {
            var div = evt.currentTarget;
            div.style.display = 'none';
            div.style.height = '0';
            div.style.backgroundImage = '';
        }

        xhr.onreadystatechange = function () {
            if (this.readyState != 4)
                return;

            if (this.status != 200) {
                console.log('Error', xhr.status, xhr.statusText);
            } else {
                gallery.innerHTML = '';
                images = xhr.responseXML.getElementsByTagName('images').item(0).getElementsByTagName('image');
                for (var i = 0; i < images.length; i++) {
                    var a = document.createElement('a');
                    a.href = path + images[i].getElementsByTagName('original').item(0).innerHTML;
                    a.setAttribute('_target', 'blank');
                    img = document.createElement('img');
                    img.src = path + images[i].getElementsByTagName('preview').item(0).innerHTML;
                    a.appendChild(img);
                    a.appendChild(document.createTextNode(images[i].getElementsByTagName('title').item(0).innerHTML));
                    //отобразить оригинальное изображение по клику - адрес берется
                    a.addEventListener('click', function (evt) {
                        evt.preventDefault();
                        showOriginal(evt.currentTarget.href);
                        return false;
                    });
                    gallery.appendChild(a);
                }
            }
        };

        xhr.open('GET','./images.xml', true);
        xhr.send();
    })
};