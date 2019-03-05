const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var commentSchema = new Schema({
    rating : {
        type : Number,
        max : 5,
        min : 1,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    author : {
       type : String,
       required : true
    }
} , {
    timestamps : true
});

var leaderSchema = new Schema ({
     name : {
         type : String,
         required : true
     },
     image : {
         type : String,
         required : true
     },
     designation : {
         type : String,
         required : true
     },
     abbr : {
         type : String,
         required :true
     },
     description : {
         type : String,
         required : true
     },
     featured : {
         type : Boolean,
         default : false
     },
     comments:[commentSchema]
} , {
    timestamps : true    
});

var Leaders = mongoose.model('Leader' , leaderSchema);

module.exports = Leaders;