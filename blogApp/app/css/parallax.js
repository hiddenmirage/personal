$(window).scroll(function () {
    var wScroll = $(this).scrollTop();

    $('.grassbox').css({

        // manipulating the transform value of the translate property
        // when I scroll, the logo is going to be bumped up 200px
        // 'transform': 'translate(0px , ' + wScroll + '%)'

    })

});
