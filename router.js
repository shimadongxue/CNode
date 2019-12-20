let express = require('express');
let User    = require('./models/user');
let Topic    = require('./models/topic')
let md5     = require('blueimp-md5');

let router = express.Router();

router.get('/', (req, res) =>{



    Topic.find({}, (err, topic) => {
        if ( err) {
            res.state(500).send('500 网络繁忙，请稍后再试！');
        } else {

            let topics = topic;
            let ids = [];
            topics.forEach(item => {

                let id = item.userId;
               if (ids.indexOf(id) !== -1) {
                   ids.push(id);
               }
            });
            let users = null;


            // let FILTER = ids.map()

            // {$or:[{'_id':ObjectId('5da04475eb24f55de4efc0dc')}]}
            User.find({}, (err, user) => {

                if ( err) {
                    res.state(500).send('500 网络繁忙，请稍后再试！');
                } else {
                    users = user;

                    var len = users.length
                    var newTopics = [];
                    topics.forEach((item) => {
                        let obj = item;

                        for (let i=0; i<len; i++) {
                            let person = users[i];
                            if (obj.userId == person._id) {
                                let u = {
                                    avatar: person.avatar,
                                    gender: person.gender,
                                    nickname: person.nickname,
                                }
                                obj.user = u;
                                newTopics.push(obj);
                                break;
                            }
                        }
                    });


                    newTopics = newTopics.reverse().slice(0,30);
                    res.render('index.html', {
                        user : req.session.user,
                        topic: newTopics
                    })
                }


            });


        }
    });

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

router.get('/download', (req, res) =>{
    res.render('download.html')
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
        res.status(200).json({
            code: 0,
            message: '登录OK'
        })
        // return res.redirect('/');
    })
})

router.get('/register', (req, res) =>{
    res.render('register.html')
});

router.get('/create', (req, res) =>{

    if (req.session.user) {
        res.render('create.html')
    } else {
        res.redirect('/login')
    }

});

router.post('/create', (req, res) => {

    let data = req.body;
    if ( data.title && data.content && req.session.user ) {

        let userId = req.session.user._id;
        data.userId = userId;
        new Topic( data ).save( (err) => {
            if ( err ) {
                return res.send(err)
            } else {

                res.status(200).json({
                    code: 0,
                    msg: '恭喜您，发布成功！'
                })
            }
        })

    } else {
        res.status(200).json({
            code: 1,
            msg: '文章信息不完整'
        });
    }

});

router.post('/logout', (req,res) => {
    if (req.session.user) {
        req.session.user = null;
    }
    res.status(200).json({
        code: 0,
        msg: '退出成功！'
    })
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
