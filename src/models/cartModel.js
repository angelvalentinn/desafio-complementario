import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                productId: {
                    type: mongoose.Schema.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        default: [],
    },
});

cartSchema.pre('find', function() {
    this.populate('products.productId');
})

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;