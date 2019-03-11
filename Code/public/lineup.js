var eventName;
var teamName;
var teams = [];
var players = [];
var meetID = Cookies.get('CookieMeetID');
var teamID;

function getTeamData() {
  var url = window.location.origin;
  $.getJSON(url + "/team/" + meetID + '/meet', (data) => {
    var options = [];
    console.log(data)
    $.each(data, (key, val) => {
      options.push("<option value='" + val.teamName + ">" + val.teamName + "</option>");
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

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to select " + eventName + " lineup");
  $("#team-select-box").removeClass("hidden");
  checkIfLineupExists();
}

$("#event-select").one("change", chooseEvent);

function getPlayers() {
  var url = window.location.origin;
  teamName = $(this).val();
  for (var i = 0; i < teams.length; i++) {
    if (teams[i].teamName == teamName){
      teamID = teams[i].teamID;
      break;
    }
  }
  $.getJSON(url + "/player/" + meetID + "/" + teamID, (data) => {
    var options = [];
    console.log(data)
    $.each(data, (key, val) => {
      options.push("<option value='" + val.name + "'>" + val.name + "</option>");
      var playerObj = {
        playerID: val.id,
        name: val.name
      }
      players.push(playerObj);
    });

    $("[id='player-picker']").append(options.join(""));
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

function checkIfLineupExists() {
  var url = window.location.origin;
  var lineup = [];
  $.getJSON(url + "/lineup/" + meetID + "/" + teamID + "/" + eventName, (data, res) => {
    if (res == "404")
      return [];
    else {
      $.each(data, (data) => {
        lineup.push(data);
      });
    }
  });
}

function sendLineup() {
  var playerNames = $(".player-name");
  console.log(players);
  var data;
  var url = window.location.origin;
  var lineup = checkIfLineupExists();
  if (lineup == []) {
    for (var i = 0; i < playerNames.length; i++) {
      var playerID;
      for (var i = 0; i < players.length; i++) {
        if ($(playerNames).text() == players[i].name) {
          playerID = players[i].id;
          break;
        }
      }

      data = {
        playerID: playerID,
        order: i,
        teamID: teamID,
        event: eventName,
        meetID: meetID
      }

      $.ajax({
        url: url + "/lineup/" + meetID + '/' + teamID + '/' + eventName,
        method: "post",
        data: data,
        success: () => {
          console.log("Sent object: " + data);
        }
      });
    }
  } else {
    for (var i = 0; i < playerNames.length; i++) {
      var playerID;
      for (var i = 0; i < players.length; i++) {
        if ($(playerNames).text() == players[i].name) {
          playerID = players[i].id;
          break;
        }
      }

      data = {
        playerID: playerID,
      }

      $.ajax({
        url: url + "/lineup/" + lineup[i].id,
        method: "put",
        data: data,
        success: () => {
          console.log("Sent object: " + data);
        }
      });
  }
  $("#lineup-complete-text").text(eventName + " lineup for " + teamName + " has been made.");
  $(".form-box").toggleClass("hidden");
}

$("#lineup-accept").click(sendLineup);
