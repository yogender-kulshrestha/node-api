const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create student schema & model
const StudentSchema = new Schema({
    name: {
        type: String,
    },
    roll: {
        type: String,
        required: [true, 'Roll field is required']
    },
    present: {
        type: Boolean,
        deafult: true
    }
},{ timestamps: true });

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    token: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    }]
}, { timestamps: true});

const BlogSchema = new Schema({
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: String,
    published: Boolean,
    author: Object,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true },
{
    toJson: { virtual: true },
    toObject: { virtual: true },
});

const CommentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog"
    },
    text: String
}, { timestamps: true});

UserSchema.virtual('domain').get(function() {
    return this.email.slice(this.email.indexOf('@') + 1);
});

BlogSchema.virtual('myComments', {
    // ref: 'Comment',
    from: 'comments',
    localField: 'blog',
    foreignField: 'id',
    justOne: false,
    // match: { isActive: true }
});

BlogSchema.virtual('myAuthor', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});

const Student = mongoose.model('Student',StudentSchema);
const User = mongoose.model("User", UserSchema);
const Blog = mongoose.model("Blog", BlogSchema);
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = {User, Blog, Comment, Student}

// module.exports = Student;
