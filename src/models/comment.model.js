const mongoose = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');


const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }
},{timestamps: true})

commentSchema.plugin(mongooseAggregatePaginate)

const Comment =  mongoose.model("Comment", commentSchema)
module.exports = Comment;