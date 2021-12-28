const path = require('path');
const { v4 } = require('uuid');


const uploadFile = ( files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {

    return new Promise( (resolve, reject) => { 
    
        const { file } = files;

        const separateName = file.name.split('.');
        const extension = separateName[ separateName.length - 1 ];

        // validate the extension
        if( !validExtensions.includes( extension ) ) {
           return reject(`The file format is not valid, only ${ validExtensions } files are accepted`);
        }

        const tempName = v4() + '.' + extension;
        const uploadPath = path.join ( __dirname, '../uploads/', folder, tempName );

        file.mv( uploadPath, (err) => {
            if(err) { 
               reject(err);
            }

            resolve( tempName );
        })

    })
}


module.exports = {
    uploadFile,
}