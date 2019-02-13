var players = [];
var playerIndex = 0;
var teamName;

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

function getPlayers() {
  var url = window.location.origin;
  teamName = this.value;
  $.getJSON(url + "/player/" + this.value, (data) => {
    $.each(data, (key, val) => {
      players.push(val.name);
    });

    $("#player-score-name").text(players[0]);
  });

  $("#scoring-box").removeClass("hidden");
}

$("#team-select").one("change", getPlayers);

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
    'vaultScore': parseFloat($(".active").text())
  }
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
        $("#scoring-box").addClass("hidden");
        $("#team-select-box").addClass("hidden");
        $("#score-complete-box").removeClass("hidden");
      }
    }
  });
  // console.log(url + "player/" + $("#player-score-name").text());
}

$("#score-accept").click(advancePlayers);
