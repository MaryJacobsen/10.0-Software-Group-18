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

  this.addClass("active");
}

$(".score-button").click(makeActive);

function advancePlayers() {
  if ($(".active") == undefined) {
    alert("Please select a score");
    return;
  }

  scoreObject = {
    vaultScore: parseFloat($(".active").text())
  }

  var url = window.location.origin;
  $.ajax({
    url: url + "player/" + $("#player-score-name").text(),
    type: "put",
    contentType: "application/JSON",
    data: scoreObject,
    success: () => {
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
}

$("#score-accept").click(advancePlayers);
