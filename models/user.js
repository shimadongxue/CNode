const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cnode_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    nickname: {
        type: String,
    },
    password: {
        type: String,
    },
    email: {
        type: String
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/imgs/avatar-default.png'
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    status: {
        type: Number,
        // 0 没有权限限制
        // 1 不可以评论
        // 2 不可以登录
        enum: [0, 1, 2],
        default: 0
    },
    slogan: {
        type: String,
        default: '暂时没有个性签名'
    },
});

module.exports = mongoose.model('User', userSchema);
