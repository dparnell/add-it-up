/*
  Plugin to render the addition vertially
*/

window.buildQuestionUI = function(dlg) {
    var h1 = e("h1");
    t(h1, "What is");
    a(dlg, h1);

    var cont = e("center");
    a(dlg, cont);
    var tab = e("table", {width: "200"});
    a(cont, tab);
    var row = e("tr");
    a(tab, row);
    var q1 = e("td", {class: "big", colspan: "2", align: "right"});
    a(row, q1);
    row = e("tr");
    a(tab, row);
    var td = e("td", {class: "big", align: "right"});
    t(td, "+");
    a(row, td);
    var q2 = e("td", {class: "big", align: "right"});
    a(row, q2);

    return function(na, nb) {
        t(q1, na);
        t(q2, nb);
    };
}
