var eventName;
var teamName;
var meetID = Cookies.getJSON('credentials').meetSession;
var teamID;
var lineup;

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
  teamID = $(this).val();
  teamName = $('#team-select option:selected').text();
  console.log("teamID: " + teamID + "\nteamName: " + teamName);
  $.getJSON(url + "/player/" + meetID + "/" + teamID, (data) => {
    var options = [];
    $.each(data, (key, val) => {
      options.push("<option value='" + val.id + "'>" + val.name + "</option>");
    });

    $(".player-picker").append(options.join(""));
  });
  checkIfLineupExists();

  $("#player-card-text").text("Edit " + teamName + " lineup:")
  $("#player-card-box").removeClass("hidden");
}

$("#team-select").one("change", getPlayers);

function setPlayer() {
  //Super stupid way to get the last part of the id which is the unique number for it.
  var id = $(this).attr('id');
  var itr = id.split("-");
  itr = parseInt(itr[2], 10);

  var playerName = $('#player-picker-' + itr + ' option:selected').text();
  console.log("Player name: " + playerName);
  $('#player-name-' + itr).text(playerName);

  $(this).addClass("player-selected");
  $('#player-name-' + itr).removeClass("hidden");
}

$(".player-picker").change(setPlayer);

function sendLineup() {
  var playerNames = $(".player-name");
  var data;
  var url = window.location.origin;
  console.log("lineup: ", lineup);
  if (lineup == undefined) {
    for (var i = 0; i < 6; i++) {
      var playerID = $('#player-picker-' + i + " option:selected").val();

      data = {
        playerID: playerID,
        teamID: teamID,
        order: i,
        event: eventName,
        meetID: meetID
      };
      console.log(data);

      $.ajax({
        url: url + "/lineup/",
        method: "post",
        headers: {
          "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
        },
        data: data,
        success: () => {
          console.log("Sent object: " + data);
        }
      });
    }
  } else {
    console.log("playerNames.length: " + playerNames.length);
    for (var i = 0; i < 6; i++) {
      var playerID = $('#player-picker-' + i + ' option:selected').val();

      data = {
        playerID: playerID
      };
      console.log(playerID);

      $.ajax({
        url: url + "/lineup/" + lineup[i],
        method: "put",
        headers: {
          "Authorization": 'Bearer ' + Cookies.getJSON('credentials').token
        },
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
