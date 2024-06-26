import mongoose from "mongoose";
import { createHash } from '../utils/functionsUtil.js'

const userCollection = "users";

const userSchema = mongoose.Schema({

    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        minLength: 5,
        require: true,
        unique: true
    },
    password: {
        type: String,
        hash: true,
        minLength: 6,
        require: true
    },
    cartId: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.ObjectId,
                    ref: "carts"
                }
            }
        ],
        default: []
    },
    role: {
        type: String,
        require: true,
        default: 'user'
    }
    
});

userSchema.pre("save", function() {
    this.password = createHash(this.password);
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;