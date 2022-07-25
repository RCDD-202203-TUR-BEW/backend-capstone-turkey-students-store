const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer',
    },
    orderData: {
        type: Data,
        required: true,
        default: Date.now
    },

    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String, 
        required: true, 
        default: 'pending', 
        enum: ['pending', 'completed', 'cancelled']
    },
    orderItems: [{
        item: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'},
        quantity: {
            type: Number,
            required: true}

        }],
    notes: {
        type: String,}

})
module.exports = mongoose.model('Order', orderSchema);

// const mongoose = require('mongoose');

// const orderSchema = mongoose.Schema({
//     total: {  
//         type: Number, 
//         required: true 
//     },
//     shopItems: {
//         type: [{
//             shopItemId: { 
//                 type: mongoose.Schema.Types.ObjectId,
//                 ref: 'Product',
//             },
//             quantity: {
//                 type: Number,
//                 required: true
//             }
//         }],
//     default: []
// },
// customerRef: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Customer'
// }
// })

// module.exports = mongoose.model('Order', orderSchema);