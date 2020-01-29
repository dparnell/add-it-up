/*
  Example 2 digit addition plugin
*/

window.timeLimit = 120; // 2 minutes

window.makeQuestion = function(_q) {
    var answer = 1 + Math.floor(Math.random() * 20); // random number between 1 and 20
    var r = {};
    r.na = Math.floor(Math.random() * answer);
    r.nb = answer - r.na;

    if(r.nb > r.na) {
        // make sure the biggest number is on the top
        var t = r.nb;
        r.nb = r.na;
        r.na = t;
    }

    r.nc = na + nb;

    return r;
}
