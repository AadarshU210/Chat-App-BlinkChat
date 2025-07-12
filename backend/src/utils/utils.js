import jwt from 'jsonwebtoken'

/* here the jwt.sign expects a plain JS object therefore pass the payload like this or we can
pass payload in signup method like this generateToken({userId: user._id})*/
export const generateToken = (userId, res) =>{
   const token = jwt.sign({userId}, process.env.JWT_SECRET,{
    expiresIn:"7d"
   })

   res.cookie("jwt", token, {
    maxAge: 7*24*60*60*1000, //Millisecond
    httpOnly:true, // prevent XSS attacks cross-site scripting attacks
    sameSite:"strict", // CSRF attacks 
    secure: process.env.NODE_ENV!=='development' // this field will determine if this https or http and this will be true if in production
  })

  return token
}
