const { Socket } = require("socket.io");

const { ChatMessages } = require('../models');
const { checkJWT } = require("../helpers");

const chatMessages = new ChatMessages();

const socketController = async ( socket = new Socket(), io ) => {

    const token = socket.handshake.headers['x-token'];
    const user = await checkJWT( token );

    if( !user ) return socket.disconnect();

    chatMessages.connectUser( user );
    io.emit('active-users', chatMessages.listOfUsers);
    socket.emit('receive-messages', chatMessages.lastTenMessages);

    socket.join( user.id );

    socket.on('disconnect', () => {
        chatMessages.disconnectUser( user.id );
        io.emit('active-users', chatMessages.listOfUsers);
    })

    socket.on('send-message', ({ uid, message }) => {

        if( uid ) {
            // private message
            return socket.to( uid ).emit('private-message',{ by: user.name, message });
        }
        
        chatMessages.sendMessage(user.id, user.name, message);
        io.emit('receive-messages', chatMessages.lastTenMessages);
    })
}


module.exports = {
    socketController,
};