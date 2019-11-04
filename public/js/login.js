$(function () {


    $('#submit').on('click',function () {

        let data = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        $.ajax({
            url: 'http://127.0.0.1:3001/login',
            method: 'post',
            contentType:"application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function (res) {

                if ( res.code === 0 ) {
                    location.href = "http://localhost:3001"
                } else {
                    alert(res.msg)
                }

            },
            fail: function (err) {
                debugger;
                console.log(err);
            }
        })
    })

})
