//content
//type
//available_to
//reward
//date_end
//quizzes [
//{
//  question:
//  answers: []
//  correct_answer:
//} 
//]

var mongoose = require('mongoose');

var contentSchema = mongoose.Schema({
    content: String,
    type: String,
    available_to: Array,
    reward: Number,
    date_end: Date,
    quizzes: Array,
});

var Content = mongoose.model('Content', contentSchema);

module.exports = Content;