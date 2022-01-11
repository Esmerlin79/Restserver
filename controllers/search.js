const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;

const { 
    User,
    Category,
    Product
} = require('../models');


const allowedCollections = [
    'user',
    'category',
    'products',
    'roles'
];

const searchUsers = async ( term = '', res = response ) => {

    try {
        
        const isMongoId = ObjectId.isValid( term );

        if( isMongoId ) {
            const user = await User.findById(term);
            return res.json({
                results: user ? [ user ] : []
            });
        }

        // case insensitive
        const regEx = new RegExp( term, 'i' );

        const users = await User.find({
            $or: [{ name: regEx }, { email: regEx }],
            $and: [{ status: true }]
        });

         res.json({
            results: users 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const searchCategories = async ( term = '', res = response ) => {

    try {
        
        const isMongoId = ObjectId.isValid( term );

        if( isMongoId ) {
            const category = await Category.findById(term);
            return res.json({
                results: category ? [ category ] : []
            });
        }

        const regEx = new RegExp( term, 'i' );

        const categories = await Category.find({ name: regEx, status: true });

         res.json({
            results: categories 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const searchProducts = async ( term = '', res = response ) => {

    try {
        
        const isMongoId = ObjectId.isValid( term );

        if( isMongoId ) {
            const product = await Product.findById(term)
                                            .populate('category', 'name');;
            return res.json({
                results: product ? [ product ] : []
            });
        }

        const regEx = new RegExp( term, 'i' );

        const products = await Product.find({ name: regEx, status: true })
                                        .populate('category', 'name');;

         res.json({
            results: products 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}


const search = (req, res = response ) => {

    const { collection, term } = req.params;
    
    if( !allowedCollections.includes(collection) ) {
        return res.status(400).json({
            msg: `The allowed collections are: ${ allowedCollections }`
        })
    }

    switch (collection) {

        case 'user':
            searchUsers( term, res );
            break;

        case 'category':
            searchCategories( term, res );
            break;

        case 'products':
            searchProducts( term, res );
            break;

        case 'roles':
            break;

        default:
            res.status(500).json({ msg: 'Not implemented yet'});
    }
}


const getProductsByCategory = async (req, res = response) => {

    try {

        const { id } = req.params;

        const products = await Product.find({ category: id });
        
        res.json( products );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const openBrowser = (req = request, res = response) => {
    res.setHeader('Content-Type', 'text/html');
    res.writeHead(200);
    res.end(`
    <html><head></head><body>
        <p>Please wait while we redirect you to Your APP NAME...</p>
        <!-- <p><a href="javascript:redirectToApp()">Open appname</a></p> -->
        <button>Redirect</button>
        <span></span>
        <script>

        var redirectToApp = function() {
            var scheme = "exp://10.0.0.162:19000";
            var openURL = "dummy-app" + window.location.pathname + window.location.search + window.location.hash;

            var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            var Android = /Android/.test(navigator.userAgent);

            var newLocation;
            if (iOS) {
            newLocation = "exp://127.0.0.1:19000" +  window.location.search + window.location.hash;
            } else if (Android) {

            newLocation = "exp://10.0.0.162:19000" +  window.location.search + window.location.hash;
            // newLocation = newLocation.replace('/#', '#');
            document.querySelector('span').innerText = newLocation;
            } else {
            newLocation = "exp://10.0.0.162:19000" +  window.location.search + window.location.hash;
            }
            console.log(newLocation)
            // window.location.replace(newLocation);
            return newLocation
        }
        // window.onload = redirectToApp;
        document.querySelector('button').addEventListener('click', () => {
            window.location.replace(redirectToApp());
        })

        </script>
        
        
        </body></html>
    `)
}

module.exports = { 
    search,
    getProductsByCategory,
    openBrowser
}