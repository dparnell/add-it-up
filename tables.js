/*
  Example times tables plugin
*/

window.timeLimit = 300; // 5 minutes
window.questionCount = 12;

document.title = "Times Tables";

var questions = [];

function shuffle(array) {
    // stolen from here: https://www.frankmitchell.org/2015/01/fisher-yates/
    var i = 0, j = 0, temp = null;
    for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}

window.showMenu = function(dlg, result) {
    a(dlg, t(e("h1"), "Choose a times table to practice"));

    function make_menu_item(index) {
        var btn = t(e("button"), index);
        btn.onclick = function() {
            kill(dlg).then(function() {
                questions = [];

                for(i=1; i<=12; i++) {
                    questions.push({na: i, nb: index, nc: i * index});
                }

                shuffle(questions);

                result.resolve();
            });
        };
        a(dlg, btn);
    }

    for(var i = 1; i <= 12; i++) {
        make_menu_item(i);
    }

}


window.makeQuestion = function(_q) {
    return questions.pop();
}

window.buildQuestionUI = function(dlg) {
    var h1 = e("h1");
    a(dlg, h1);

    return function(na, nb) {
	      t(h1, "What is " + na + " x " + nb + " ?");
    };
}

window.format_result = function(result) {
    return result.a + " x " + result.b + " = " + result.answer;
}
