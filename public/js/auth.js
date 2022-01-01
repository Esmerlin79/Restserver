      
const form = document.querySelector('form');

const url_base = ( window.location.hostname.includes('localhost')) 
                        ? 'http://localhost:4000' 
                        : 'https://restserver-node-es.herokuapp.com';

form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = {};

    for( let el of form.elements ) {
        if( el.name.length > 0 ) 
            formData[el.name] = el.value;
    }
    
    fetch(`${url_base}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify( formData ),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json() )
    .then( ({ msg, token }) => {
        if( msg ) return console.error( msg );
        localStorage.setItem('token',token);
        window.location = 'chat.html';
    })
    .catch( err => console.log );
})

function onSignIn(googleUser) {

    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    var id_token = googleUser.getAuthResponse().id_token;
    const data = { id_token };

    fetch(`${url_base}/api/auth/google`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then( resp => resp.json() )
    .then( ({ token }) => {
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch( console.log );    
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}