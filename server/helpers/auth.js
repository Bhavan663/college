const brcypt = require('bcrypt');

const hashPassword = (password) =>{
    return new Promise((resolve,reject) =>{
        brcypt.genSalt(12,(err,salt) =>{
            if(err){
                reject(err)
            }
            brcypt.hash(password,salt,(err,hash) =>{
                if(err){
                    reject(err)
                }
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password,hashed) =>{
    return brcypt.compare(password,hashed)
}

module.exports = {
    hashPassword,
    comparePassword,
}