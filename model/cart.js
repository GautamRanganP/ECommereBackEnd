const mongoose = require('mongoose')
const schema = mongoose.Schema
const product = require('./product')
const user = require('./user')

const cartSchema = new schema({
    userId:{
        type:schema.Types.ObjectId,
        ref:user,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
   products:[
        {
            _id:{
                type:schema.Types.ObjectId,
                ref:product,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
   ]
})

module.exports =mongoose.model('cart',cartSchema)