import { messagesModel } from '../dbManagers/models/messages.models.js'

export default class Messages {
    constructor(){}

    getMessages = async () =>{
        const messages = await messagesModel.find();
        return messages;
    }

    addMessage = async (user, message) =>{
        const createMessage = {user, message};
        const newMessage = await messagesModel.create(createMessage);
        return newMessage;
    }
}