var teams = [];
var players = [];
var numTeams;
var itr = 0;

function getNumTeams() {
  numTeams = parseInt($('#num-teams').val(), 10);
  if (isNaN(numTeams)) {
    alert("Please enter a valid non-negative whole number");
    $('#number-teams-accept').one('click', getNumTeams);
  } else {
    teamNameAccept = $('#name-accept');
    for (var i = 0; i < numTeams; i++) {
      $('#name-accept').before("<input type=\"text\" id=\"team-" + i + "\" placeholder=\"Insert Name of Team\">");
    }
    $('#team-names-box').removeClass('hidden');
  }
}

$('#number-teams-accept').one('click', getNumTeams);

function submitPlayers(name) {
  playersVal = $('.' + name);
  for (var i = 0; i < playersVal.length; i++) {
    $(playersVal[i]).val();
  }
}

function allFilled(name) {
  var bool = true;
  playersVal = $('.' + name);
  for (var i = 0; i < playersVal.length; i++) {
    console.log($(playersVal[i]).val());
    if ($(playersVal[i]).val() == null)
      bool = false;
  }
  if (bool) {
    itr++;
    getTeamData();
  } else {
    alert("Please make sure every gymnast field is filled in.");
    $('#' + name + '-players-accept').one('click', () => {
      submitPlayers(name);
    });
  }
}

function addPlayerBoxes(name) {
  var numPlayers = parseInt($('#' + name + '-num-players').val(), 10);
  var htmlStr = "<h3 class=\"form-text\">Gymnasts for " + name + "</h3>";
  for (var i = 0; i < numPlayers; i++) {
    htmlStr += "<input type=\"text\" class=\"" + name + "\" placeholder=\"Insert Name of Gymnast\">";
  }
  htmlStr += "<input type=\"submit\" id=\"" + name + "-players-accept\" value=\"Accept\">";

  $('#' + name + '-num-accept').after(htmlStr);
  $('#' + name + '-num-accept').addClass('hidden');
  $('#' + name + '-players-accept').one('click', () => {
    submitPlayers(name);
  });
}

function createPlayersBox(name) {
  var htmlStr = "<div class=\"form-box\" id=\"name-players\"><h3 class=\"form-text\">Number of Gymnasts for " + name + "</h3><input type=\"text\" id=\"" + name + "-num-players\" placeholder=\"Enter number of gymnasts for " + name + "\"><input type=\"submit\" id=\"" + name + "-num-accept\" value=\"Accept\"></div>";
  $('#team-names-box').after(htmlStr);
  $('#' + name + '-num-accept').one('click', () => {
    addPlayerBoxes(name)
  });
}

function getTeamData() {
  var name = $('#team-' + itr).val()
  teams.push(name);
  createPlayersBox(name);
}

$('#name-accept').one('click', getTeamData);
