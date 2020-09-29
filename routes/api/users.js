const express = require ('express'); 
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require ('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//fake user example: hannah30, 12345678
const User = require('../../models/User'); 
//@route    POST api/users
//register a new user

router.post('/',
[
    check ('userid', 
           'Please enter a user id with 8 - 32 characters (using a-z, A-Z, and 0-9)')
           .isLength({min:8, max:32}),
///[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)]/
    check(
        'password',
        'Please enter a password with 8 - 16 characters')
        .isLength({min: 8, max: 16})
] ,
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {userid, password} = req.body; //filter out the parameters you need

    try{
        //see if user exists
        let user = await User.findOne({userid});

        if(user){
            return res.status(400).json({ errors: [{ msg: 'User already exists'}] });
        }


        user = new User ({ 
            userid,
            password
        });
        
        const salt = await bcrypt.genSalt(10); //encrypt password - bcrypt
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        //return jsonwebtoken - logged in right away
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign (payload, 
            config.get('jwtSecret'),
            {expiresIn: 360000},
            (err, token) => {
                if (err) throw err;
                res.json({token});
            });
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }

    
});

module.exports = router;