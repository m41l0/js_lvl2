/* докозательство того, что в JS всё является объектом
 [
 (1).constructor,
 true.constructor,
 [].constructor,
 "".constructor,
 (function () {}).constructor,
 {}.constructor,
 (/./).constructor,
 NaN.constructor
 ]*/


var a = {
        prop: 1,
        f: function () {
            console.log(this.prop);
        }
    },
    b = {
        prop: 2,
        f: function () {
            console.log(this.prop);
        }
    };

a.f();
b.f();

var newFunc = a.f;// присваиваем новой переменной ссылку на фнукцию объекта 'a'
newFunc();// undefined, т.к. изменился контекст функции

var newFunc = a.f.bind(b);// меняем контекст объекта 'a', на контекст обеъекта 'b'
newFunc();// 2, т.к. this теперь указывает на объект 'b'

console.log('==============================================');
a.f = a.f.bind(b);// заменили функию на ту же самую, только с другим контекстом
a.f();// 2
b.f();// 2

// так работать не будет
a.f = b.f;
a.f();// 1
b.f();// 2

// контекст функции можно изменить только один раз
console.log('==============================================');

var newFunc2 = a.f.bind(b);// первый раз заменили контекст у функции 'f'
newFunc2 = newFunc2.bind(a);// пытаемся заменить контекст у функции 'f' второй раз
newFunc2(); // 2 - значение свойства prop из объекта 'b', т.е. вторая замена контекста не сработала

console.log('================Работа с call==============================');

var summ = function (a, b) {
    return this.prop + a + b;
};

var a1 = {
        prop: 1,
        f: summ
    },
    b1 = {
        prop: 2,
        f: summ
    };

// a1.f = a1.f.bind(b1, 1, 1);
// b1.f = b1.f.bind(a1, 2, 2);
// a1.f();
// b1.f();

console.log(summ.apply(a1, [1, 1]));// аргументы из массива
console.log(summ.call(b1, 2, 2));// аргументы через запятую

console.log('==============================================');

var a2 = {
    prop: 1,
    f: function () {
        var func = function () {
            console.log(this.prop);
        };

        func();
    }
};

a2.f();// undefined, т.к. функция func вызывается как есть, у нее контекст сбрасывается
       // на глобальный (в браузера это window), и т.к. в windows нет свойства prop, получаем - undefined

var a3 = {
    prop: 1,
    f: function () {
        var func = function () {
            console.log(this.prop);
        };

        func.call(this);// пробросили контекст
    }
};

a3.f();// 1


var a4 = {
    prop: 1,
    f: function () {
        var that = this;// кэшируем контекст

        var func = function () {
            console.log(that.prop);// передали контекст через замыкание
        };

        func.call();// пробросили контекст
    }
};

a4.f();// 1


console.log('================bind() умеет накапливать аргументы==============================');
var newFunc3 = summ.bind(a, 1, 1);
console.log('newFunc3 - ', newFunc3());// 3, функция отработала, как и положено

var newFunc4 = summ.bind(a, 1);
console.log('newFunc4 - ', newFunc4());// NaN, т.к. передали только один аргумент в функцию,
                                       // а 2-й аргумент остался неопределенным

newFunc4 = newFunc4.bind(a, 1);
console.log('newFunc4 - ', newFunc4());// опять 3, т.к. bind сохранила 1-й аргумент, и здесь мы добавили
                                       // еще аргумент, который стал 2-м

newFunc5 = summ.bind(a, 1).bind(a, 1);// можно записать и так, 1-й bind привязвается к 1-му аргументу,
                                      // 2-й соответстенно ко 2-му
console.log('newFunc5 - ', newFunc5());

// также если первый аргумент "прибиндить", то потом аргументы мождно передавать прямо в функции, вот так:
newFunc6 = summ.bind(a, 1);
console.log('newFunc6 - ', newFunc6(7));

console.log('==========================================================================');
console.log('==========================================================================');

var F = function () {

};
// если вызвать функцию с ключевым словом new, то создастся пустой объект
var obj = new F();
console.log(obj);