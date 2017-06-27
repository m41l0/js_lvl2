/* Домашнее задание
 3	Создайте форму обратной связи с полями: Имя, Телефон, e-mail, текст, кнопка «Отправить».
 При нажатии на кнопку отправить производите валидацию полей следущим образом:
 - Имя содержит только буквы
 - Телефон подчиняется шаблону +7(000)000-0000
 - E-mail выглядит как mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru
 - Текст произвольный.
 - В случае непрохождения валидации одним из полей необходимо выделять это поле
 красной рамкой и сообщать пользователю об ошибке. */

window.onload = function () {


    /*    var text = "'текст', в котором для обозначения 'диалогов' используются 'одинарные' кавычки." +
     " Придумайте 'шаблон', который меняет 'одинарные' кавычки на 'двойные', aren't don't and AREN'T DON'T.";
     var regExp1 = /(^|\W)'|'(\W|$)/g;

     console.log(text.replace(regExp1, '$1"$2'));
*/

     console.log('=================================================================');
    // console.log(document.getElementsByClassName('form-control'));
    // console.log(document.forms);

    var regExpName = /[a-zа-яё]/ig;
    // var regExpTel = /[a-zа-яё]/ig;
    // var regExpEmail = /[a-zа-яё]/ig;
    // var regExpText = /[a-zа-яё]/ig;


    //обработчик
    document.getElementById('btn').addEventListener('click', function () {
        var inputName = document.getElementById('name').value;
        var inputTel = document.getElementById('tel').value;
        var inputEmail = document.getElementById('email').value;
        var inputText = document.getElementById('text').value;
        // console.log(inputName);
        // console.log(inputName.match(regExpName));

        // if (inputName === inputName.match(regExpName).join('')) {
        //     console.log(document.getElementById('name').parentNode.className);
        //     var className = document.getElementById('name').parentNode.className;
        //     document.getElementById('name').parentNode.className = className + ' has-success';
        // } else {
        //     var className2 = document.getElementById('name').parentNode.className;
        //     document.getElementById('name').parentNode.className = className2 + ' has-error';
        //     alert('В имени могут быть только буквы');
        // }

        switch (inputName) {
            case inputName.match(regExpName).join(''):
                console.log('ttt');
                document.getElementById('name').parentNode.className = 'form-group has-success';
            case '2':
            case '3':
            case '4':
            case '5':
            default:
                document.getElementById('name').parentNode.className = 'form-group has-error';
                break
        }


    })

};