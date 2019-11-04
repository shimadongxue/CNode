let express = require('express');
let User    = require('./models/user');
let md5     = require('blueimp-md5');

let router = express.Router();

router.get('/', (req, res) =>{


    // new User(user).save(function (err, data) {
    //     if (err) {
    //         console.log(err);
    //         // return next(err)
    //     }
    //
    //     console.log('user save');
    //     console.log(data);
    //
    // })
    res.render('index.html', {
        user : req.session.user
    })
});

router.get('/blog', (req, res) => {
    User.find({}, (err, data) => {
        if ( err) {
            res.state(500).send('500 网络繁忙，请稍后再试！');
        } else {
            console.log('数据库--------');
            console.log(data);
        }
    });
});

router.get('/login', (req, res) =>{
    res.render('login.html')
});

router.post('/login', ( req, res)=> {
    let body = req.body;

    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, ( err, user)=> {
        if ( err) {
            return res.status(500).json({
                code: 1,
                msg: '网络繁忙， 请稍后再试！'
            })
        }

        if (!user) {
            return res.status(200).json({
                code: 1,
                msg: '密码错误.'
            })
        }
        req.session.user = user;
        return res.redirect('/');
    })
})

router.get('/register', (req, res) =>{
    res.render('register.html')
});

router.post('/register', (req, res) => {

    let body = req.body;

    User.findOne({
        $or: [{
            email: body.email
        }, {
            nickname: body.nickname
        }]
    }, (err, data) => {

        if (err) {
            return res.status(500).send('服务器异常！');
        }

        if ( data ) {
            return res.status(200).json({
                code: 1,
                msg: '用户名 或 邮箱已经存在！'
            })
        }

        body.password = md5(md5(body.password));
        new User( body ).save( (err, user) => {
            if ( err ) {
                return res.send(err)
            } else {
                // return res.status(200).json({
                //     msg: '恭喜您,注册成功!',
                //     success: true,
                //     code: 0
                // });

                // req.session.user = user
                res.redirect('/login')
            }
        })
    })


});

module.exports = router;
