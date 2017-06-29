/*ЗАДАНИЯ 1-2*/

//форматирует текст в соответсвии с правилами и выводит его в нужное
function formatText() {
    var inputText = document.getElementById('input-text').value;
    var outputText = inputText.replace(/(\B')|('\B)/g, '"');
    document.getElementById('output-text').value = outputText;
}

//переключение отображения элементов (элемент, общий для всех класс,
function switchDisplay(element, baseClassName, currentClassName, defaultClassName) {
    var defaultClassName = baseClassName + ' ' + defaultClassName;//т
    if(element.className === defaultClassName) {//если элемент "выключен"
        var elements = element.parentNode.getElementsByClassName(currentClassName); //todo
        var currentClassName = baseClassName + ' ' + currentClassName; //todo
        for (var i = 0; i < elements.length; i++) {
            elements[i].className = defaultClassName;//все элементы "
        }
        element.className = currentClassName;//текущий элемент активе
        return true;
    } else {
        return false;
    }
}

//переключение отображения между вариантами текста
function switchLayer(element) {
    if (switchDisplay(element, 'switch-button', 'on', 'off')) {//если
        var textId = '';//идентификатор textarea с текстом
        switch (element.id) {
            case 'input-button':
                textId = 'input-text';//идентификатор введенного текста
                break;
            case 'output-button':
                formatText();//текст форматируется по правилам
                textId = 'output-text';//идентификатор отформатированного
                break;
        }
        if (textId) {
            switchDisplay(document.getElementById(textId), 'reg-text');//todo
        }
    }
}

/*ЗАДАНИЕ 3*/

//класс для работы с формой и правилами проверки
function FormExt(form) {
    var form, isFieldsCorrect, rules;
    this.form = form;//выбранная форма
    this.isFieldsCorrect = false;//флаг результатов проверки
    this.rules = new Array();//массив с правилами, ключи - имена полей
    this.rules['name'] = {
        regExp: /^([а-яё]{1,})|([a-z]{1,})$/i,
        errorText: 'Только буквы, или латинские, или кириллица'
    };
    this.rules['phone'] = {
        regExp: /^\+7\(\d{3}\)\d{3}\-\d{4}$/,
        errorText: 'Формат должен быть +7(000)000-0000'
    };
    this.rules['email'] = {
        regExp: /aa/,
        errorText: 'Только валидный почтовый адрес, например, name@domen.com'
    };
    this.rules['text'] = {
        regExp: /.+/,
        errorText: 'Любые символы, хотя бы один'
    };
}

//проверяется вся форма
FormExt.prototype.checkForm = function () {
    this.isFieldsCorrect = true;//предпологается, что они верны
    var currentField = null;//проверяемое поле формы
    for (var key in this.rules) {
        currentField = this.form.elements[key];
        if (this.checkField(currentField.value, this.rules[key].regExp)) { //todo
            this.switchError(currentField);//убирается ошибка
        } else {
            this.isFieldsCorrect = false;//если хотяб бы одна ошибка
            this.switchError(currentField, this.rules[key].errorText); //todo
        }
    }
    return this.isFieldsCorrect;
};

//проверка по регулярному выражению (значение, выражение)
FormExt.prototype.checkField = function (value, rule) {
    return rule.test(value);
};

//переключается видимость ошибки (поле, текст ошибки - если нет, знач //todo )
FormExt.prototype.switchError = function (field, text) {
    var errorText = field.parentNode.getElementsByClassName('error-text'); //todo
    if (text) {
        errorText.innerHTML = text;
        field.className = 'error-field';
    } else {
        errorText.innerHTML = '';
        field.className = '';
    }
};

window.onload = function () {
    //добавляются функции для интерфейса заданий 1-2
    var visibilityButtons = document.getElementsByClassName('switch-button'); //todo
    for (var i = 0; i < visibilityButtons.length; i++) {
        visibilityButtons[i].addEventListener('click', function (event) { //todo
            switchLayer(event.currentTarget);
        });
    }

    //добавляются функции проверки формы задания 3
    var userForm = new FormExt(document.getElementById('user-data'));
    userForm.form.addEventListener('submit', function (event) {
        if (!userForm.checkForm()) {//если полей формы неудачна
            event.preventDefault();
            return false;
        }
    })
};