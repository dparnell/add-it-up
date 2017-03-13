/*
 * Application JS here
 */

/*
  Base on CSS Animation code by Osvaldas Valutis, www.osvaldas.info
  Available for use under the MIT License
*/

;( function ( document, window, index )
   {
       var s = (document.body || document.documentElement).style, prefixAnimation = "", prefixTransition = "";

       if( s.WebkitAnimation === "" ) prefixAnimation  = "-webkit-";
       if( s.MozAnimation === "" )    prefixAnimation  = "-moz-";
       if( s.OAnimation === "" )    prefixAnimation  = "-o-";

       if( s.WebkitTransition === "" )  prefixTransition = "-webkit-";
       if( s.MozTransition === "" )   prefixTransition = "-moz-";
       if( s.OTransition === "" )   prefixTransition = "-o-";

       window.onCSSAnimationEnd = function( that, callback )
       {
           var runOnce = function( e ){ callback(); e.target.removeEventListener( e.type, runOnce ); };
           that.addEventListener( "webkitAnimationEnd", runOnce );
           that.addEventListener( "mozAnimationEnd", runOnce );
           that.addEventListener( "oAnimationEnd", runOnce );
           that.addEventListener( "oanimationend", runOnce );
           that.addEventListener( "animationend", runOnce );
           if( ( prefixAnimation === "" && !( "animation" in s ) ) || getComputedStyle( that )[ prefixAnimation + "animation-duration" ] == "0s" ) callback();
           return that;
       };
   }( document, window, 0 ));

/*
 * Some simple DOM manipulation functions
 */

// append an element
function a(p, e) {
    p.appendChild(e);

    return e;
}

// remove a child element
function r(e) {
    e.parentNode.removeChild(e);
}

// set element text
function t(e, c) {
    e.innerText = c;
    return e;
}

// find an element by id
function f(i) {
    return document.getElementById(i);
}

// create an element
function e(type, atts) {
    var element = document.createElement(type);
    if(atts) {
        for(var a in atts) {
            element.setAttribute(a, atts[a]);
        }
    }

    return element;
}

function addClass(e, c) {
    e.setAttribute("class", e.getAttribute("class") + " " + c);

    return e;
}

function removeClass(e, c) {
    var klasses = e.getAttribute("class").split(" ");
    e.setAttribute("class", klasses.filter(function(klass) { return klass != c; }).join(" "));
    return e;
}

/*
 * A very simplistic promise object
 */

function P() {
    this.resolved_value = undefined;
    this.resolved = false;
    this.failed_value = undefined;
    this.failed = false;
    this.ok = [];
    this.nope = [];
}

P.prototype.then = function(f) {
    if(this.resolved) {
        f(this.resolved_value);
    } else {
        this.ok.push(f);
    }

    return this;
};

P.prototype.fail = function(f) {
    if(this.rejected) {
        f(rejected_value);
    } else {
        this.not.push(f);
    }
};

P.prototype.resolve = function(v) {
    if(!this.resolved && !this.rejected) {
        this.resolved_value = v;
        this.resolved = true;

        var L = this.ok.length;
        for(var i=0; i<L; i++) {
            var r = this.ok[i](v);
            if(r) {
                if(r instanceof P) {
                    // handle the case where a then returns a new promise
                    r.ok = r.ok.concat(this.ok.slice(i + 1));
                    return this;
                } else {
                    this.resolved_value = v = r;
                }
            }
        }
    }

    return this;
};

P.prototype.reject = function(v) {
    if(!this.rejected && !this.resolved) {
        this.rejected_value = v;
        this.rejected = true;

        var L = this.nope.length;
        for(var i=0; i<L; i++) {
            this.nope[i](v);
        }
    }

    return this;
};

/*
 * AJAX code
 */

function ajax(method, url, obj) {
    var result = new P();

    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for older browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status >= 200 && this.status <= 299) {
                result.resolve(JSON.parse(this.responseText));
            } else {
                result.reject(this.responseText);
            }
        }
    };
    xmlhttp.open(method, url, true);
    if(obj && method != "GET") {
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.send(JSON.stringify(obj));
    } else {
        xmlhttp.send();
    }

    return result;
}

/*
 * Utility functions
 */

function kill(e) {
    var result = new P();
    addClass(e, "fade");
    onCSSAnimationEnd(e, function() {
        r(e);
        result.resolve();
    });

    return result;
}

function ask(m) {
    var result = new P();
    var dlg = e("div", {class: "ask dialog visible"});
    a(dlg, t(e("h1"), m));
    var txt = e("input", {type: "text"});
    a(dlg, txt);
    var btn = t(e("button"), "Okay");
    a(dlg, btn);

    function done() {
        if(txt.value) {
            kill(dlg).then(function() {
                result.resolve(txt.value);
            });
        }
    }

    btn.onclick = done;

    a(document.body, dlg);
    txt.focus();
    txt.onkeypress = function(e) {
        if(e.keyCode == 13) {
            done();
        }
    };

    return result;
}

/*
 *  The actual game starts here
 */

function play_game() {
    var result = new P();

    question = 0;

    function the_time() {
        return (new Date()).getTime() / 1000;
    }

    var dlg = e("div", {class: "ask dialog visible"});
    var h1 = e("h1");
    a(dlg, h1);
    var txt = e("input", {type: "text"});
    a(dlg, txt);
    var btn = t(e("button"), "Okay");
    a(dlg, btn);


    var results = [];
    var question = 0;
    var start_time = null;
    var na, nb;

    function done() {
        if(txt.value) {
            var end_time = the_time();

            results.push({
                a: na,
                b: nb,
                answer: Number(txt.value),
                correct_answer: na + nb,
                time_taken: end_time - start_time
            });
            next_question();
        }
    }

    btn.onclick = done;

    function times_up() {
        kill(dlg).then(function() {
            result.resolve({message: "Times Up!", results: results});
        });
    }

    var timer = window.setTimeout(times_up, 60 * 1000);


    a(document.body, dlg);
    txt.focus();
    txt.onkeydown = function(e) {
        if(e.keyCode == 8 || e.keyCode == 13 || (e.keyCode >= 48 && e.keyCode <= 57)) {
            // do nothing;
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    txt.onkeypress = function(e) {
        if(e.keyCode == 13) {
            done();
        }
    };

    function next_question() {
        question++;
        if(question > 33) {
            window.clearTimeout(timer);

            kill(dlg).then(function() {
                result.resolve({message: "All Done", results: results});
            });
        } else {
            if(question < 5) {
                na = Math.floor(Math.random() * 4);
                nb = Math.floor(Math.random() * 4);
            } else if(question < 10) {
                na = Math.floor(Math.random() * 8);
                nb = Math.floor(Math.random() * 8);
            } else {
                na = Math.floor(Math.random() * 10);
                nb = Math.floor(Math.random() * 10);
            }
            start_time = the_time();

            t(h1, "What is " + na + " + " + nb + " ?");
            txt.value = "";
            txt.focus();
        }
    }
    next_question();

    return result;
}

function show_menu(player_name) {
    var result = new P();
    var dlg = e("div", {class: "menu dialog visible"});
    a(dlg, t(e("h1"), "Hi " + player_name));

    a(dlg, t(e("p"), "Get ready to add some numbers!"));

    var btn = t(e("button"), "Okay");
    btn.onclick = function() {
        kill(dlg).then(function() {
            result.resolve();
        });
    };
    a(dlg, btn);

    a(document.body, dlg);
    return result;
}

function format(n) {
    return n.toFixed(2);
}

function show_results(results) {
    var next = new P();

    var dlg = e("div", {class: "results dialog visible"});
    var h1 = t(e("h1"), results.message);
    var answer, result, is_correct, correct_count, total_time;
    a(dlg, h1);
    var h2 = e("h2");
    a(dlg, h2);

    total_time = 0;
    correct_count = 0;
    var L = results.results.length;
    for(var i=0; i<L; i++) {
        result = results.results[i];
        is_correct = result.answer == result.correct_answer;
        if(is_correct) {
            correct_count++;
        }
        answer = e("div", {class: is_correct ? "correct" : "wrong"});
        a(dlg, t(answer, result.a + " + " + result.b + " = " + result.answer + " in " + format(result.time_taken) + "s"));
        total_time += result.time_taken;
    }

    if(L<33 || total_time > 60) {
        total_time = 60.0;
    }

    results.correct_count = correct_count;
    results.total_time = total_time;

    a(dlg, t(e("div"), "You took " + format(total_time) + " seconds"));

    if(correct_count == 33) {
        t(h2, "Congratulations. You got them all correct!");
    } else {
        t(h2, "You got " + correct_count + " out of 33 correct");
    }

    var btn = t(e("button"), "Okay");
    btn.setAttribute("disabled", "disabled");

    var scores = null;

    a(dlg, btn);
    btn.onclick = function() {
        kill(dlg).then(function() {
            next.resolve(scores);
        });
    };

    a(document.body, dlg);


    ajax("POST", "/db.php", results).then(function(the_scores) {
        scores = the_scores;
        btn.removeAttribute("disabled");
    });

    return next;
}

function show_high_scores(scores) {
    var next = new P();

    var dlg = e("div", {class: "results dialog visible"});
    a(dlg, t(e("h1"), "Best Scores"));

    var best = {};
    var i, j, L = scores.length;

    var div, ul, li, n;

    div = e("div", {class: "score-section"});
    a(dlg, div);
    ul = e("table", {class: "scores"});
    li = a(ul, e("tr"));
    a(li, t(e("th"), ""));
    a(li, t(e("th"), "Name"));
    a(li, t(e("th"), "Score"));
    a(li, t(e("th"), "Time"));

    for(i=0; i<L; i++) {
        li = a(ul, e("tr", {class: "score-item"}));
        a(li, t(e("td", {class: "rank"}), i + 1));
        a(li, t(e("td", {class: "player-name"}), scores[i][0]));
        a(li, t(e("td", {class: "score"}), scores[i][1]));
        a(li, t(e("td", {class: "time"}), scores[i][2].toFixed(2)));

        a(div, ul);
    }

    var btn = t(e("button"), "Okay");

    a(dlg, btn);
    btn.onclick = function() {
        kill(dlg).then(function() {
            next.resolve();
        });
    };

    a(document.body, dlg);

    return next;
}

function game_loop(player_name) {
    show_menu(player_name).then(play_game).then(function(results) {
        results.player_name = player_name;

        show_results(results).then(show_high_scores).then(function() {
            game_loop(player_name);
        });
    });
}

function start_game() {
    ask("What is your name?").then(game_loop);
}

start_game();
