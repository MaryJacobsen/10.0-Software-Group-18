var eventName;
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

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to select " + eventName + " lineup");
  $("#team-select-box").removeClass("hidden");
}

$("#event-select").one("change", chooseEvent);

function getPlayers() {
  var url = window.location.origin;
  teamName = this.value;
  $.getJSON(url + "/player/" + this.value, (data) => {
    var players = [];
    console.log(data)
    $.each(data, (key, val) => {
      players.push("<option value='" + val.name + "'>" + val.name + "</option>");
    });

    $("[id='player-picker']").append(players.join(""));
  });

  $("#player-card-text").text("Edit " + teamName + " lineup:")
  $("#player-card-box").removeClass("hidden");
}

$("#team-select").one("change", getPlayers);

function setPlayer() {
  var elem = $(this);
  playerText = elem.parent().children(".player-name");
  playerName = elem.val();

  $(this).addClass("player-select");
  playerText.text(playerName);
  playerText.removeClass("hidden");
}

$("[id='player-picker']").change(setPlayer);

function sendLineup() {
  var players = $(".player-name");
  console.log(players);
  var data = [];
  for (var i = 0; i < players.length; i++) {
    data.push({
      player: $(players[i]).text(),
      order: i,
      team: teamName,
      event: eventName
    });
  }

  var url = window.location.origin;
  $.ajax({
    url: url + "/lineup",
    method: "post",
    // dataType: "json",
    data: data,
    success: () => {
      console.log("In success");
      $("#lineup-complete-text").text(eventName + " lineup for " + teamName + " has been made.");
      $(".form-box").toggleClass("hidden");
    }
  });
}

$("#lineup-accept").click(sendLineup);
