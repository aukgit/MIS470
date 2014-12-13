
/*
 * Written by Alim Ul Karim
 * Developers Organism
 * https://www.facebook.com/DevelopersOrganism
 * mailto:info@developers-organism.com
*/

$(function () {
    var devBackBtns = $("a.dev-btn-back");
    if (devBackBtns.length > 0) {
        devBackBtns.click(function (e) {
            e.preventDefault();
            history.back();
        });
    } 

});
