$(document).ready(function() {
    $('.tabs .tab-links a').click(function(event)  {
        var currentAttrValue = $(this).attr('href');
        console.log(currentAttrValue);
        // Show/Hide Tabs
        $('.tabs ' + currentAttrValue).fadeIn(500).siblings().hide();
        // Change/remove current tab to active
        $(this).parent('li').addClass('active').siblings().removeClass('active');
        event.preventDefault();
    });
});