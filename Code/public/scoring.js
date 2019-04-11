var players = [];
var playerIndex = 0;
var meetID = Cookies.getJSON('credentials').meetSession;
var teamID;
var eventName;
var teamName;
var itr = 0;

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to score for " + eventName);
  $("#team-select-box").removeClass("hidden");
}

$("#event-select").one("change", chooseEvent);

function getLineup() {
  var url = window.location.origin;
  teamID = $('#team-select option:selected').val();
  teamName = $('#team-select option:selected').text();

  $.getJSON(`${url}/lineup/${meetID}/${teamID}/${eventName}`)
  .done((data) => {
    console.log(data);
    //for each lineup object
    $.each(data, (itr, val) => {
      //Get player based off playerID in order to get the gymnasts name
      $.getJSON(`${url}/player/${val.playerID}`, (gymnast) => {
        players.push({
          name: gymnast[0].name,
          playerID: val.playerID
        });
        if (itr == 0) {
          $('#player-name').text('Currently scoring ' + players[0].name);
          $('#player-name-box').removeClass("hidden");
          $('.scoring-box-container').removeClass("hidden");
          $('.scoring-box').removeClass('hidden');
          $('#accept-box').removeClass("hidden");
        }
      });
    });
  });
}

$("#team-select").one("change", getLineup);

function changeScoreButtons() {
  var id = $(this).attr('id');
  var tok = id.split('-');
  var tab = parseInt(tok[0], 10);
  var judge = parseInt(tok[1], 10);
  var value = 95;

  //If a score was active it should no longer be.
  $('#scoring-container-' + judge).children().removeClass('active');

  //Changes all of the scoring buttons in the body of the scoring container.
  var scoreButtons = $('#scoring-container-' + judge).children();
  for (var i = 0; i < scoreButtons.length; i++) {
    //This either hides or unhides all boxes accept for 10.0 if 10 is selected.
    if (tab == 10 && value != 0)
      $(scoreButtons[i]).addClass('hidden');
    else if ($(scoreButtons[i]).hasClass('hidden') && tab != 10)
      $(scoreButtons[i]).removeClass('hidden');
    //If a 5 is chosen a zero needs to be added before.
    if (value == 5) {
      valString = tab + '.05';
    } else { //Otherwise the value is fine (unless value = 0).
      var valString = tab + '.' + value;
      //This appends an extra zero onto #.0 to make it #.00 and also resizes the box
      if (value == 0 && tab != 10) {
        valString += '0';
      }
    }
    //Lastly this resizes the box if a 10 is used or was previously used.
    if ($(scoreButtons[i]).hasClass('expanded'))
      $(scoreButtons[i]).removeClass('expanded')
    else if (value == 0 && tab == 10)
      $(scoreButtons[i]).addClass('expanded');

    $(scoreButtons[i]).text(valString);
    value -= 5;
  }

  //This changes the active tab and removes the old active tab.
  var selected = $('.selected');
  for (var i = 0; i < selected.length; i++) {
    var res = $(selected[i]).children().attr('id');
    res = res.split('-');
    if (judge == parseInt(res[1], 10)) {
      $(selected[i]).removeClass('selected');
    }
  }
  $(this).parent().addClass('selected');
}

$('.tab-button').click(changeScoreButtons);

function makeActive() {
  var buttons = $(this).parent().children();
  for (var i = 0; i < buttons.length; i++) {
    if ($(buttons[i]).hasClass('active')) {
      $(buttons[i]).removeClass('active');
    }
  }
  $(this).addClass('active');
}

$('.score-button').click(makeActive);

function advancePlayers() {
  console.log("Advance");
  var empty = false;

  //Checks if any of the boxes do not have an active score
  var scoringContainer = $('.score-container');
  for (var i = 0; i < scoringContainer.length; i++) {
    console.log($(scoringContainer[i]).children().hasClass('active'))
    if (!$(scoringContainer[i]).children().hasClass('active')) {
      $('#accept-text').text('A scoring box was left blank');
      $(scoringContainer[i]).parent().addClass('score-error');
      var height = $(scoringContainer[i]).parent().height();
      $(scoringContainer[i]).parent().height(parseInt(height) - 10);
      empty = true;
    } else {
      $(scoringContainer[i]).parent().removeClass('score-error');
    }
  }

  if (empty) {
    return;
  }

  var scoringBoxes = $('.scoring-box');
  for (var i = 0; i < scoringBoxes.length; i++) {
    //Get judgeID from by parsing the id of the container
    var judgeID = $(scoringBoxes[i]).attr('id');
    judgeID = judgeID.split('-');
    judgeID = parseInt(judgeID[2], 10);

    var active = $('#scoring-container-' + judgeID).find('.active');

    scoreObject = {
      playerID: players[playerIndex].playerID,
      judgeID: judgeID,
      score: parseFloat($(active).text()),
      event: eventName,
      exhibition: 0,
      meetID: meetID
    }

    var url = window.location.origin;
    $.ajax({
      url: url + "/score/",
      method: "post",
      headers: {
        "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
      },
      // dataType: "json",
      data: scoreObject,
      success: () => {console.log("Post succeeded");}
    });
  }
  playerIndex++;
  if (players[playerIndex] != undefined) {
    $('.score-error').removeClass('score-error');
    $('#accept-text').text("Please double check each Judge's scores are correct.");
    $('.active').removeClass('active');
    $('#player-name').text('Currently scoring ' + players[playerIndex].name);
  }
  else {
    $("#scoring-complete-text").text(eventName.charAt(0).toUpperCase() + eventName.substr(1) + " scoring for " + teamName + " has been completed");
    $(".form-box").toggleClass("hidden");
    $('.scoring-box').toggleClass('hidden');
  }
}

$("#score-accept").click(advancePlayers);
