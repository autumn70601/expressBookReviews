const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (user)=>{ //returns boolean
    let filtered_users = users.filter((user)=> user.username === user);
    if(filtered_users){
        return true;
    }
    return false;
}
const authenticatedUser = (username,password)=>{ //returns boolean
    if(isValid(username)){
        let filtered_users = users.filter((user)=> (user.username===username)&&(user.password===password));
        if(filtered_users){
            return true;
        }
        return false;
       
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let user = req.body.username;
  let pass = req.body.password;
  if(!authenticatedUser(user,pass)){
      return res.status(403).json({message:"User not authenticated"})
  }

  let accessToken = jwt.sign({
      data: user
  },'access',{expiresIn:60*60})
  req.session.authorization = {
      accessToken
  }
  res.send("User logged in Successfully")

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let isbn = req.params.isbn;
    let review = req.body;

    // Check if review is provided
    if (!review) {
        return res.status(400).json({ message: "Review needed" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add the review to the book
    books[isbn].reviews.push(review);

    // Return success message
    return res.status(200).json({ message: "Review added" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
