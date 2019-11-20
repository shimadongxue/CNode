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
    general: {
        type: Number,
        enum: [1, 2, 3, 4],
        default: 1
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: String,
    },
    content: {
        type: String,
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Topic', topicSchema);
