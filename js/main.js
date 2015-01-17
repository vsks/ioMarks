$(document).ready(function(){
  var ioToken = "0ceb21edbfbc00680f9c3c061b5d731a";
  var ioAPI = "http://devapi.saved.io/v1/";
  var urls = [ioAPI + "lists", ioAPI + "bookmarks"];

  var ioQ = {};
  ioQ.token = ioToken;

  var ioJXHR = [];
  var ioLists;
  var ioMarks;

  // --- Get data from saved.io ---
  // ------------------------------
  $.each(urls, function(i, url){
    ioJXHR.push(
      $.getJSON(url, ioQ, function (json){
        if (i === 0) { ioLists = json; } else { ioMarks = json; }
      })
    );
  });

  // --- Display and react ---
  // -------------------------
  $.when.apply($, ioJXHR).done(function(){

    $(".spinner").remove();

    var ioSelected = 0;
    var ioMulSel = true;

    function listSpanTGL(lSel, state){
      if (state){
        $(lSel).toggleClass('uslct', false);
        $(lSel).toggleClass('slct', true);
        $(lSel).attr('data-selected', state.toString());
      } else {
        $(lSel).toggleClass('uslct', true);
        $(lSel).toggleClass('slct', false);
        $(lSel).attr('data-selected', state.toString());
      }
    }

    function resetToAll(){
      listSpanTGL('.all', true);
      listSpanTGL('.lists', false);
      $('.links').show();
      ioSelected = 0;
    }

    // --- Load all categories and create click events ---
    // ---------------------------------------------------

    // --- 'multiselect' button ---
    $("#cat").append(
      $('<span>').attr('class', 'tag slct mulsel custombtn visible-xs-inline visible-sm-inline')
      .attr('title', 'multiselect')
      .attr('data-selected', true)
      .text('multiselect')
    );

    $('.mulsel').click(function(){
      ioMulSel = !ioMulSel;
      listSpanTGL('.mulsel', ioMulSel);
    });

    // --- 'all' button ---
    $("#cat").append(
      $('<span>').attr('class', 'tag custombtn slct all')
      .attr('title', 'all')
      .attr('data-selected', true)
      .text('all')
    );

    $('.all').click(function(){
      if ($(this).attr('data-selected') !== 'true'){
        resetToAll();
      }
    });

    // load lists
    $.each(ioLists, function(i, ioList){
      $("#cat").append(
        $('<span>').attr('class', 'lists ' + ioList.name + ' uslct tag custombtn').
        attr('title', ioList.name).
        attr('data-selected', 'false').
        text(ioList.name)
      );
    });

    resetToAll();

    $('.lists').click(function(e){
      var linkSel = '.links.' + this.classList[1];
      var bSelector = ($(this).attr('data-selected') === 'true');
      var touchSel = ($('.mulsel:visible').attr('data-selected') === 'true');
      var tMulti = e.shiftKey || e.ctrlKey || touchSel;
      var tSelector = '.' + this.classList[0] + '.' + this.classList[1];

      if(!tMulti){
        if (bSelector && (ioSelected == 1)) {
          resetToAll();
        } else {
          ioSelected = 1;
          listSpanTGL('.all', false);
          listSpanTGL('.lists', false);
          listSpanTGL(tSelector, true);
          $('.links').hide();
          $(linkSel).show();
        }
      } else {
        if (bSelector){
          ioSelected--;
          if (ioSelected === 0){
            resetToAll();
          } else {
            listSpanTGL(tSelector, false);
          }
        } else {
          if (ioSelected === 0){
            listSpanTGL('.all', false);
            $('.links').hide();
          }
          ioSelected++;
          listSpanTGL(tSelector, true);
        }
        $(linkSel).toggle();
      }
    });

    // --- Load all bookmarks ---
    // --------------------------
    $.each(ioMarks, function(i, ioMark){
      $("#bookmarks").append(
        $('<li>').attr('class','links ' + ioMark.list_name).append(
          $('<a>').attr('href','http://' + ioMark.url)
          .attr('class', 'link ' + ioMark.list_name)
          .attr('target', '_blank')
          .text(ioMark.url)
        )
      );
    });

    // --- generate search query and google it ---
    // -------------------------------------------
    function srch(s){
      var url="http://www.google.com/search?q=" + s;
      var links = [];
      $.each($('li:visible.links').find('a'), function(){
        var a = document.createElement('a');
        a.href = $(this).attr('href');
        links.push(a.hostname.toLowerCase());
      });
      if (links.length === 0){
        $.each($('.link'), function(){
          var a = document.createElement('a');
          a.href = $(this).attr('href');
          links.push(a.hostname.toLowerCase());
        });
      }

      // ---       find only unique values       ---
      // --- http://stackoverflow.com/a/15868720 ---
      var uniqLinks = links.slice()
      .sort(function(a,b){ return a - b; })
      .reduce(function(a,b){
        if (a.slice(-1)[0] !== b) a.push(b);
        return a;
      },[]);

      $.each(uniqLinks, function(i, link){
        if(i === 0){
          url = url + "+site:" + link;
        } else {
          url = url + "+OR+site:" +link;
        }
      });
      //alert(url);
      window.open(url, '_blank');
    }

    $(":text").keypress(function(e){
      if(e.which == 13){
        srch($(this).val());
      }
    });
  });
});
