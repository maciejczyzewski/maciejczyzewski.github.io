/*!                   main.js | © 2014 Maciej A. Czyzewski                  !*/

/* =========================================================================
   Application
   ========================================================================= */

$( document ).ready(function() {
    $(".highlight").addClass("hl"); // Source Codes
    $("body").fitVids();            // Videos, Images

    // KaTeX
    var readyStateCheckInterval=setInterval(function(){if(document.readyState==="complete"){var e=document.getElementsByClassName("equation");Array.prototype.forEach.call(e,function(e){katex.render("\\displaystyle{"+e.getAttribute("data-expr")+"}",e)});clearInterval(readyStateCheckInterval)}},10)
});