var eventName;
var teamName;
var teams = [];
var players = [];
var meetID = Cookies.get('CookieMeetID');
var teamID;
var lineup;

function getTeamData() {
  var url = window.location.origin;
  $.getJSON(url + "/team/" + meetID + '/meet', (data) => {
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

function chooseEvent() {
  var elem = $(this);
  eventName = elem.val();
  $("#team-select-text").text("Pick team to select " + eventName + " lineup");
  $("#team-select-box").removeClass("hidden");
}

$("#event-select").one("change", chooseEvent);

function checkIfLineupExists() {
  var url = window.location.origin;
  $.getJSON(url + "/lineup/" + meetID + "/" + teamID + "/" + eventName, (data) => {
    if (data.length != 0) {
      lineup = [];
      $.each(data, (key, val) => {
        lineup.push(val.id);
      });
    }
  });
}

function getPlayers() {
  var url = window.location.origin;
  teamName = $(this).val();
  for (var i = 0; i < teams.length; i++) {
    if (teams[i].teamName == teamName){
      console.log("teams[i].teamName: " + teams[i].teamName);
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
  var exists = checkIfLineupExists();

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
  var playerNames = $(".player-name");
  console.log(players);
  var data;
  var url = window.location.origin;
  console.log("lineup: ", lineup);
  if (lineup == undefined) {
    for (var i = 0; i < playerNames.length; i++) {
      var playerID;
      for (var j = 0; j < players.length; j++) {
        if ($(playerNames[i]).text() == players[j].name) {
          playerID = players[j].playerID;
          break;
        }
      }

      data = {
        playerID: playerID,
        teamID: teamID,
        order: i,
        event: eventName,
        meetID: meetID
      }
      console.log(data);

      $.ajax({
        url: url + "/lineup/",
        method: "post",
        data: data,
        success: () => {
          console.log("Sent object: " + data);
        }
      });
    }
  } else {
    console.log("playerNames.length: " + playerNames.length);
    for (var i = 0; i < playerNames.length; i++) {
      var playerID;
      for (var j = 0; j < players.length; j++) {
        if ($(playerNames[i]).text() == players[j].name) {
          playerID = players[j].playerID;
          break;
        }
      }

      data = {
        playerID: playerID,
      }

      console.log(lineup[i]);

      $.ajax({
        url: url + "/lineup/" + lineup[i],
        method: "put",
        data: data,
        success: () => {
          console.log("Sent object: " + data);
        },
        error: (err) => {
          console.log(err.responseJSON);
        }
      });
    }
  }
  $("#lineup-complete-text").text(eventName.charAt(0).toUpperCase() + eventName.substr(1) + " lineup for " + teamName + " has been made.");
  $(".form-box").toggleClass("hidden");
}

$("#lineup-accept").click(sendLineup);
