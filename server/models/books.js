const mongoose=require('mongoose');
const booksSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    publicationYear: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports=mongoose.model('Book',booksSchema);