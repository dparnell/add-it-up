/*
Example 3 digit addition plugin
*/

window.timeLimit = 300; // 5 minutes

window.makeQuestion = function(_q) {
    var answer = 1 + Math.floor(Math.random() * 999); // random number between 1 and 999
    var r = {};
    r.na = Math.floor(Math.random() * answer);
    r.nb = answer - r.na;

    if(r.nb > r.na) {
	// make sure the biggest number is on the top
	var t = r.nb;
	r.nb = r.na;
	r.na = t;
    }

    return r;
}
