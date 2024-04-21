const express=require('express');
const router=express.Router();
const Book=require('../models/books')
const multer=require('multer');
const fs=require('fs');
var moment=require('moment');


//image upload
var storage=multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'uploads');
    },
    filename: function(req,file,cb) {
        cb(null,file.fieldname+"-"+Date.now()+"-"+file.originalname)
    }

})

var upload=multer({
    storage: storage,
}).single('image');



//Insert a user into database
router.post("/add",upload,async (req,res) => {
    try {
        const book=new Book({
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
            publicationYear: req.body.publicationYear,
            image: req.file.filename,
        })
        Book.create(book);
        req.session.message={
            type: 'success',
            message: 'Book information is added successfully!'
        };

    } catch(err) {
        res.json({message: err.message,type: 'danger'})
    }
    res.redirect('/')




})

//get all users route
router.get("/",async (req,res) => {

    try {
        const books=await Book.find().exec();
        res.render("index.ejs",{title: 'Home Page',books: books,moment: moment});

    } catch(err) {
        res.json({message: err.message});
    }

})

//route for opening  user add view
router.get("/add",(req,res) => {
    res.render("add_books.ejs",{title: 'Add Books'});
});

//rendering specific user information by its ID
router.get("/edit/:id",async (req,res) => {
    try {
        let id=req.params.id;
        const book=await Book.findById(id).exec();
        if(book==null) {
            res.redirect('/')
        } else {
            res.render("edit_books.ejs",{title: 'Edit Book',book: book});
        }

    } catch(err) {
        res.redirect('/');
    }



});

//update user route
router.post("/update/:id",upload,async (req,res) => {
    let id=req.params.id;
    let new_image='';
    try {

        if(req.file) {
            new_image=req.file.filename

            try {
                fs.unlinkSync('uploads/'+req.body.old_image)
            } catch(err) {
                console.log(err)
            }

        } else {
            new_image=req.body.old_image;
        }
        await Book.findByIdAndUpdate(id,{
            title: req.body.title,
            genre: req.body.genre,
            description: req.body.description,
            publicationYear: req.body.publicationYear,
            image: new_image

        });

        req.session.message={
            type: 'success',
            message: 'Book Information updated successfully'
        }
        res.redirect('/');

    } catch(err) {
        res.json({message: err.message,type: 'danger'})
    }




});

//delete user route
router.get("/delete/:id",async (req,res) => {
    try {
        let id=req.params.id;

        await Book.findByIdAndDelete(id).then((result) => fs.unlinkSync('uploads/'+result.image))

        req.session.message={
            type: 'success',
            message: 'User deleted successfully'
        }
        res.redirect('/');
    }

    catch(err) {
        res.json({message: err.message,type: 'danger'})
    }
})










module.exports=router;