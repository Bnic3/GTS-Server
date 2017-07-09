/**
 * Created by john.nana on 7/9/2017.
 */

moduel.exports= function(){

    var tokenizer=()=>{
        var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        length= 6;
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }


    return {
            tokenizer: tokenizer
    }
};
