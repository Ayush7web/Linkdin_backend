const mongoose = require("mongoose");


// linkdinClone


mongoose.connect('mongodb://localhost:27017/linkdinClone').then( res =>{

console.log('database succesfully connected')
}).catch(err =>{
  console.log('error')
})