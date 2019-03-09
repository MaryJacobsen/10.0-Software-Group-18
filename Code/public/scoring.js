var players = [];
var playerIndex = 0;
var teamName;
var eventName;

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to score for " + eventName);
  $("#team-select-box").removeClass("hidden");
}

$("#event-select").one("change", chooseEvent);

function getTeamData() {
  var url = window.location.origin;
  $.getJSON(url + "/team/teams", (data) => {
    var teams = [];
    console.log(data)
    $.each(data, (key, val) => {
      teams.push("<option value='" + val.teamName + "'>" + val.teamName + "</option>");
    });

    $("#team-select").append(teams.join(""));
  });
}

window.onload = getTeamData();

function getLineup() {
  var url = window.location.origin;
  teamName = this.value;
  $.getJSON(url + "/lineup/" + this.value + "/" + eventName, (data) => {
    $.each(data, (key, val) => {
      players.push(val.player);
    });

    $("#player-score-name").text(players[0]);
  });

  $("#scoring-box").removeClass("hidden");
}

$("#team-select").one("change", getLineup);

function makeActive(event) {
  $(".active").removeClass("active");
  var elem = $(this);
  elem.addClass("active");
}

$(".score-button").click(makeActive);

function getScoreObject() {
  if (eventName == "vault") {
    return scoreObject = {
      vaultScore: parseFloat($(".active").text())
    }
  } else if (eventName == "bars") {
    return scoreObject = {
      barsScore: parseFloat($(".active").text())
    }
  } else if (eventName == "beam") {
    return scoreObject = {
      beamScore: parseFloat($(".active").text())
    }
  } else {
    return scoreObject = {
      floorScore: parseFloat($(".active").text())
    }
  }
}

function advancePlayers() {
  console.log("Advance");
  if (!$(".score-button").hasClass("active")) {
    alert("Please select a score");
    return;
  }

  scoreObject = getScoreObject();

  var url = window.location.origin;
  $.ajax({
    url: url + "/player/" + $("#player-score-name").text(),
    method: "PUT",
    // dataType: "json",
    data: scoreObject,
    success: () => {
      console.log("In success");
      playerIndex++;
      $("#player-score-name").text(players[playerIndex]);

      $(".active").removeClass("active");

      if (players[playerIndex] == undefined) {
        $("#scoring-complete-text").text(eventName + " scoring for " + teamName + " has been completed");
        $(".form-box").toggleClass("hidden");
      }
    }
  });
  // console.log(url + "player/" + $("#player-score-name").text());
}

$("#score-accept").click(advancePlayers);
