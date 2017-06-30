$(document).ready(function() {
    $('.tabs .tab-links a').click(function(event)  {
        var currentAttrValue = $(this).attr('href');

        // скрываем вкладки, кроме остальных
        $('.tabs ' + currentAttrValue).fadeIn(1000).siblings().hide();

        // добавляем/удаляем для нужного пункта меню класс active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        event.preventDefault();
    });
});