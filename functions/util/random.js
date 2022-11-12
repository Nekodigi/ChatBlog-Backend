

//n digit random char include lower alphabet and number
exports.randomChar = (n) => { 
    var n = n || 15; s = '', r = 'abcdefghijklmnopqrstuvwxyz0123456789';//ABCDEFGHIJKLMNOPQRSTUVWXYZ
    for (var i=0; i < n; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
    return s;
}