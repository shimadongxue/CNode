
$(function () {
    let $Title = $('.title');
    let $Content = $('.content');

    $('.submit-btn').on('click', function () {

        let general = $('.general').val() || 1;
        let title   = $('.title').val();
        let content = $('.content').val();

        if ( title.length < 10) {
          $('.title').addClass('red');
        }
        let data = {
            general: general,
            title: title,
            content: content
        };
        $.ajax({
            url: '/create',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify(data),
            success:  function (res) {
                if ( res.code === 0 ) {
                    console.log('恭喜您，发布成功！');
                    alert(res.msg);
                    $Title.val('');
                    $Content.val('');
                    $('.general').value = 1;
                } else {
                    alert(res.msg)
                }
            },
            fail: function (err) {
                console.log(err);
            }
        })
    });


    // $Title.on('input', function () {
    //     let val = $Title.val();
    //
    //     let len = val.length;
    //     if ( len !== 0 && len < 10 ) {
    //         $Title.addClass('red');
    //     } else {
    //         $Title.removeClass('red');
    //     }
    // });

    $Title.on('blur', function () {
        let val = $Title.val();
        let len = val.length;
        if ( len !== 0 && len < 10 ) {
            $Title.addClass('red');
        } else {
            $Title.removeClass('red');
        }
    });
});
