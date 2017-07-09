/**
 * Created by john.nana on 7/9/2017.
 */

exports.verifyJwt= (req,res,next)=>{
    var salt= process.env.SALT;
    var sub_token = req.sub_token

    jwt.verify(sub_token, salt, function(err, decoded) {
     if (err) {
     return res.json({ success: false, message: 'Failed to authenticate token.' });
     } else {
     // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();


     }
     });

}
