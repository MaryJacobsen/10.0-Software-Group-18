var teams = [];
var judges = [];
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
    if ($(playersVal[i]).val() == '')
      bool = false;
  }
  if (bool) {
    itr++;
    getTeamData();
  } else {
    alert("Please make sure every gymnast field is filled in.");
    $('#' + name + '-players-accept').one('click', () => {
      allFilled(name);
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
    allFilled(name);
  });
}

function createPlayersBox(name) {
  var htmlStr = "<div class=\"form-box\" id=\"name-players\"><h3 class=\"form-text\">Number of Gymnasts for " + name + "</h3><input type=\"text\" id=\"" + name + "-num-players\" placeholder=\"Enter number of gymnasts for " + name + "\"><input type=\"submit\" id=\"" + name + "-num-accept\" value=\"Accept\"></div>";
  $('#end').before(htmlStr);
  $('#' + name + '-num-accept').one('click', () => {
    addPlayerBoxes(name)
  });
}

function getTeamData() {
  if (itr != numTeams) {
    var name = $('#team-' + itr).val()
    teams.push(name);
    createPlayersBox(name);
  } else {
    $('#judge-box').removeClass('hidden');
  }
}

$('#name-accept').one('click', getTeamData);

function getNumJudges() {
  numJudges = parseInt($('#num-judges').val(), 10);
  if (isNaN(numJudges)) {
    alert("Please enter a valid non-negative whole number");
    $('#number-judges-accept').one('click', getNumJudges);
  } else {
    judgeNameAccept = $('#judge-accept');
    for (var i = 0; i < numJudges; i++) {
      $('#judge-accept').before("<input type=\"text\" class=\"judge\" placeholder=\"Insert Name of Judge\">");
    }
    $('#name-of-judges-text').removeClass('hidden');
    $('#judge-accept').removeClass('hidden');
  }
}

$('#number-judges-accept').one('click', getNumJudges);

function getJudgeData() {
  judgeNames = $('.judge');
  for (var i = 0; i < judgeNames.length; i++) {
    console.log("judges[" + i + "]: " + $(judgeNames[i]).val());
    judges.push($(judgeNames[i]).val());
  }
  $('#review-box').removeClass('hidden');
}

$('#judge-accept').one('click', getJudgeData);

function postPlayer(name, meet, team) {
  var url = window.location.origin;
  var playerObj = {
    name: name,
    teamID: team,
    meetID: meet
  }
  $.ajax({
    url: url + '/player/',
    method: 'POST',
    data: playerObj,
    dataType: 'JSON',
    success: (data, res) => {
      console.log("postPlayer-Succeeded in creating player: " + name + "\nData: " + data);
      console.log("postPlayer-Data: " + data);
    }
  });
}

function postTeam(name, meet) {
  var url = window.location.origin;
  var teamObj = {
    teamName: name,
    meetID: meet
  }
  $.ajax({
    url: url + '/team',
    method: 'POST',
    data: teamObj,
    dataType: 'JSON',
    success: (data, res) => {
      console.log("postTeam-Succeeded in creating team: " + name);
      console.log("postTeam-Data: " + data);
      var players = $('.' + name);
      for (var i = 0; i < players.length; i++) {
        console.log()
        postPlayer($(players[i]).val(), meet, data.id);
      }
    }
  });
}

function postJudge(name, meet) {
  var url = window.location.origin;
  var judgeObj = {
    name: name,
    meetID: meet
  }
  $.ajax({
    url: url + '/judge',
    method: 'POST',
    data: judgeObj,
    dataType: 'JSON',
    success: (data, res) => {
      console.log("postJudge-Succeeded in creating judge: " + name);
      console.log("postJudge-Data: " + data);
    }
  });
}


function submissionAccept() {
  var url = window.location.origin;
  var date = new Date();
  var nameStr = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
  var meetObj = {
    name: nameStr
  }
  $.ajax({
    url: url + '/meet/',
    method: 'POST',
    data: meetObj,
    dataType: 'JSON',
    success: (data, res) => {
      console.log("postMeet-Succeeded in creating meet");
      console.log("postMeet-Data: " + data);
      var inHalfAday = 0.5;
      Cookies.set('CookieMeetID', data.id, {
        expires: inHalfAday
      });
      console.log("Cookies.get('CookieMeetID'): " + Cookies.get('CookieMeetID'));
      for (var i = 0; i < teams.length; i++) {
        postTeam(teams[i], data.id);
      }
      for (var i=0; i < judges.length; i++) {
        postJudge(judges[i], data.id);
      }
    }
  });
  $('.form-box').toggleClass('hidden');
}

$('#submission-accept').one('click', submissionAccept);
