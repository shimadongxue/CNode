$(function () {


    $('#submit').on('click',function () {

        let data = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        $.ajax({
            url: '/login',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function (res) {
                if ( res.code === 0 ) {
                    // location.href = "http://localhost:3001"
                    window.location.href = '/'
                } else {
                    alert(res.msg)
                }

            },
            fail: function (err) {
                console.log(err);
            }
        })
    });

    $('.logout-btn').on('click', function () {
        $.ajax({
            url: '/logout',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            success:  function (res) {
                if ( res.code === 0 ) {
                    // location.href = "http://localhost:3001"
                    window.location.href = '/login'
                } else {
                    alert(res.msg)
                }
            },
            fail: function (err) {
                console.log(err);
            }
        })
    });

})
