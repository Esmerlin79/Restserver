const url_base = ( window.location.hostname.includes('localhost')) 
                        ? 'http://localhost:4000' 
                        : 'https://restserver-node-es.herokuapp.com';

let user = null;
let socket = null;

// Html references
const txtUid     = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers    = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnLogout  = document.querySelector('#btnLogout');


const validateJWT = async () => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ) {
        window.location = 'index.html';
        throw new Error('There is no token on the server');
    }

    const resp = await fetch(`${url_base}/api/auth`, {
        headers: { 'x-token': token }
    })

    const { user: userDB, token: tokenDB } = await resp.json();
   localStorage.setItem('token', tokenDB);
   user = userDB;
   document.title = user.name;

   await connectSocket();
}

const connectSocket = async () => {

    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('user connected', user.name)
    })

    socket.on('disconnect', () => {
        console.log('user offline', user.name)
    })

    socket.on('receive-messages', drawMessages);
    
    socket.on('active-users', drawUsers);
    
    socket.on('private-message', ( payload ) => {
        console.log('private', payload)
    })
}

const drawUsers = ( users = [] ) => {

    let usersHtml = '';
    users.map( ({ name, uid }) => {
        
        usersHtml += ` 
            <li>
                <p>
                    <h5 class="text-success">${ name }</h5>
                    <span class="fs-6 text-muted">${ uid }</span>
                </p>
            </li>
        `;

        ulUsers.innerHTML = usersHtml;
    })
}

const drawMessages = ( messages = [] ) => {

    let messagesHtml = '';
    messages.map( ({ name, message }) => {
        
        messagesHtml += ` 
            <li>
                <p>
                    <span class="text-primary">${ name }: </span>
                    <span>${ message }</span>
                </p>
            </li>
        `;

        ulMessages.innerHTML = messagesHtml;
    })
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
    
    const message = txtMessage.value;
    const uid = txtUid.value;

    if( keyCode !== 13 ) return;
    if( message.trim().length === 0 ) return;

    socket.emit('send-message', { message, uid });    

    txtMessage.value = '';
})

const main = async () => {

    await validateJWT();
}

main();
