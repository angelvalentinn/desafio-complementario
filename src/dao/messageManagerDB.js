import messageModel from "./models/messageModel.js";

class MessageManagerDB {
    async getMessages() {
        try {
            return await messageModel.find().lean();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al obtener mensajes");
        }
    }

    async addMessage(user, message) {
        try {
            const newMessage = await messageModel.create({ user, message });
            return newMessage.toObject();
        } catch (error) {
            console.error(error.message);
            throw new Error("Error al crear un mensaje");
        }
    }
}

export { MessageManagerDB };
