var players = [];
var teams = [];
var judges = [];
var playerIndex = 0;
var meetID = Cookies.get("CookieMeetID");
var teamID;
var judgeID;
var eventName;
var teamName;
var url;

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to score for " + eventName);
  $("#team-select-box").removeClass("hidden");
  getJudgeData();
}

$("#event-select").one("change", chooseEvent);

function getJudgeData() {
  $.getJSON(url + '/judge/meet/' + meetID, (data) => {
    var options = [];
    console.log(data);
    $.each(data, (key, val) => {
      options.push("<option value'" + val.name + "'>" + val.name + "</option>");
      var judgeObj = {
        name: val.name,
        id: val.id
      }
      judges.push(judgeObj);
    });
    $('#judge-select').append(options.join(""));
  });
}

function getLineup() {
  for (var i = 0; i < teams.length; i++) {
    if (teams[i].teamName == $(this).val()) {
      teamID = teams[i].teamID;
      teamName = teams[i].teamName;
      break;
    }
  }
  //Get the lineup that is currently set.
  $.getJSON(url + "/lineup/" + meetID + "/" + teamID + "/" + eventName, (data) => {
    console.log(data);
    //for each lineup object
    $.each(data, (key, val) => {
      //Get player based off playerID in order to get the gymnasts name
      $.getJSON(url + "/player/" + val.playerID, (gymnast) => {
        //push the playerName, playerID, and id into an array of players for storage
        players.push({
          name: gymnast[0].name,
          playerID: val.playerID,
          id: val.id
        });
      });
    });
  });
  //Allow for judge scoring box to be seen
  $("#judge-select-text").text("Pick which judge is scoring " + eventName);
  $("#judge-select-box").removeClass("hidden");
}

$("#team-select").one("change", getLineup);

function getTeamData() {
  url = window.location.origin;
  $.getJSON(url + "/team/" + meetID + "/meet", (data) => {
    var options = [];
    console.log(data)
    $.each(data, (key, val) => {
      options.push("<option value='" + val.teamName + "'>" + val.teamName + "</option>");
      var teamObj = {
        teamID: val.id,
        teamName: val.teamName
      }
      teams.push(teamObj);
    });
    $("#team-select").append(options.join(""));
  });
}

window.onload = getTeamData();

function chooseJudge() {
  var elem = $(this);
  var judgeName = elem.val();
  for (var i = 0; i < judges.length; i++) {
    if (judges[i].name == $(this).val()) {
      judgeID = judges[i].id;
      break;
    }
  }
  $("#player-score-name").text(players[0].name);
  $("#scoring-box").removeClass("hidden");
}

$("#judge-select").one("change", chooseJudge);

function makeActive(event) {
  $(".active").removeClass("active");
  var elem = $(this);
  elem.addClass("active");
}

$(".score-button").click(makeActive);

function advancePlayers() {
  console.log("Advance");
  if (!$(".score-button").hasClass("active")) {
    alert("Please select a score");
    return;
  }

  scoreObject = {
    playerID: players[playerIndex].playerID,
    judgeID: judgeID,
    score: parseFloat($('.active').text()),
    event: eventName,
    exhibition: 0,
    meetID: meetID
  }

  var url = window.location.origin;
  $.ajax({
    url: url + "/score/",
    method: "post",
    // dataType: "json",
    data: scoreObject,
    success: () => {
      console.log("In success");
      playerIndex++;
      if (players[playerIndex] != undefined) {
        $("#player-score-name").text(players[playerIndex].name);

        $(".active").removeClass("active");
      }
      else {
        $("#scoring-complete-text").text(eventName.charAt(0).toUpperCase() + eventName.substr(1) + " scoring for " + teamName + " has been completed");
        $(".form-box").toggleClass("hidden");
      }
    }
  });
  // console.log(url + "player/" + $("#player-score-name").text());
}

$("#score-accept").click(advancePlayers);
