const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //res.send(JSON.stringify(books,null,4));   
  let myPromise = new Promise((resolve,reject) => {
    if(books){
        resolve(res.status(300).send(JSON.stringify(books,null,4)));
    }
    else{
        reject(new Error("Error"));
    }
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   // let isbn = Number(req.params.isbn);

  return new Promise((resolve,reject)=>{

    let isbn = Number(req.params.isbn);
    
    if (isbn > 10 || isbn < 1){
        reject(res.status(400).json({message:"Error"}));
    }
    else {
        resolve(res.status(200).send(JSON.stringify(books[isbn])));
    }
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
        
    let authorName = req.params.author;

    for (let key in books){

        if (books[key].author === authorName){

            resolve(res.status(200).send(JSON.stringigy(books[key])));

        } else {

            reject(res.status(400).send({message:"Please Enter valid author name"}))
        }

    }

})
/*
  let author = req.params.author;
  let booksAuthor = [];
    for(var key in books){
        //res.status(200).write(key);
        if (books[key].author === author) {
            booksAuthor.push(books[key]);
            //res.send(JSON.stringify(books[key], null, 4));
            //resolve(res.status(200).send(JSON.stringigy(books[key])));
        }
        else {
            //res.send(`Book with author name not found.`);
        }
    }
    if(booksAuthor.length > 0){
        res.send(JSON.stringify(booksAuthor, null, 4));
    }
    else{
        res.send(`Book with author name not found.`);
    }*/
    /*
    */

    
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return new Promise((resolve,reject)=>{
        
    let title = req.params.title;

    for (let key in books){

        if (books[key].title === title){

            resolve(res.status(200).send(JSON.stringigy(books[key])));

        } else {

            reject(res.status(400).send({message:"Please Enter valid title"}))
        }

    }

 })
  /*
  let title = req.params.title;
  let titleFound = 0;
  for(var key in books){
      //res.status(200).send(title);
      if (books[key].title === title) {
          //res.send(JSON.stringify(books[key], null, 4));
          titleFound = 1;
          res.status(200).send(JSON.stringify(books[key]));
      }
  }
  if(titleFound == 0){
    res.send(`Book not found.`);
  }*/

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = Number(req.params.isbn);
  if(isbn < 10 && isbn > 0){
    res.send(JSON.stringify(books[isbn].reviews));
  }
  else{
    res.send(`Book not found.`);
  }
});

module.exports.general = public_users;
