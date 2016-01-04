/**
 * Created by owenchen on 15-12-31.
 */
$(".dropdown-menu li a").click(function(){
    var selText = $(this).text();
    $(this).parents('.btn-group').find('.dropdown-toggle').html(selText+' <span class="caret"></span>');
});

//$("#btnSearch").click(function(){
//    alert($('.btn-select').text()+", "+$('.btn-select2').text());
//});

$('div').each(function() {
    var fillClass = ($(this).height() > $(this).width())
        ? 'fillheight'
        : 'fillwidth';
    $(this).find('img').addClass(fillClass);
});

$('#scroll').click(function() {
    $('body').animate({scrollTop: +750}, 1000);
})