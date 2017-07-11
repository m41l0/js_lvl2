var F = function () {

};

// если вызвать функцию с ключевым словом new, то функция вернет новый пустой объект
var obj = new F();
console.log(obj);

console.log('==================================================');

var F1 = function (name) {
    this.name = name;
};

// this будет принадлежать текущему объекту
var obj1 = new F1('Максим'),
    obj2 = new F1('Андрей');
console.log(obj1);
console.log(obj2);
console.log(obj2.constructor);

console.log('======================добавляем методы============================');
var F2 = function (name) {
    this.setName = function (name) {
        this.name = name;
    };

    this.getName = function () {
        return this.name;
    };

    this.setName(name);
};

var obj3 = new F2('Катерина');
console.log(obj3.getName());
obj3.setName('София');
console.log(obj3.getName());

console.log('======================работаем с prototype============================');
var F3 = function (name) {
    this.setName(name);
};

F3.prototype.setName = function (name) {
    this.name = name;
};

F3.prototype.getName = function () {
    return this.name;
};

var obj4 = new F3('Andrew');
console.log(F3.prototype);
console.log(obj4);
console.log(F3.prototype === obj4.__proto__); //true

console.log('======================Наследование методов !ошибка! ============================');
var F4 = function (name, age) {
    this.setName(name);
    this.setAge(age);
};

// F4.prototype = F3.prototype;
inherit(F4, F3);

F4.prototype.setAge = function (age) {
    this.age = age;
};

F4.prototype.getAge = function () {
    return this.age;
};

var obj5 = new F3('Сергей'),
    obj6 = new F4('Андрей', 30);

obj5.setAge(12);
console.log(obj5.getName());
console.log(obj6.getName(), obj6.getAge());
console.log(obj5.getName(), obj5.getAge()); // тоже появились новые методы, ошибка на строке 64 (F4.prototype = F3.prototype;)

console.log('======================правильное наследование============================');
function inherit(child, parent) {
    var Temp = function () {};
    Temp.prototype = parent.prototype;
    child.prototype = new Temp();
};



console.log(obj5.getName(), obj5.getAge());
console.log(obj6.getName(), obj6.getAge());
