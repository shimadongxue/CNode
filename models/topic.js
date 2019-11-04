const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cnode_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;

const topicSchema = new Schema({
    title: {
      type: String
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
    },


    last_modified_time: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String,
        default: '/public/imgs/avatar-default.png'
    },

});

module.exports = mongoose.model('Topic', topicSchema);
