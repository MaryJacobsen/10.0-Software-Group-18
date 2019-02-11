var teams = [
  ["OSU", "osu1", "osu2", "osu3", "osu4", "osu5", "osu6", "osu7", "osu8"],
  ["UW", "uw1", "uw2", "uw3", "uw4", "uw5", "uw6", "uw7", "uw8"],
  ["UO", "uo1", "uo2", "uo3", "uo4", "uo5", "uo6", "uo7", "uo8"],
  ["UCLA", "ucla1", "ucla2", "ucla3", "ucla4", "ucla5", "ucla6", "ucla7", "ucla8"]
];

let once = {
  once : true
}

var teamIndex;
var playerIndex = 1;

function getPlayers(event) {
  for (var i = 0; i < teams.length; i++) {
    if(teams[i][0] == event.target.value) {
      teamIndex = i;
      break;
    }
  }

  var playerName = document.getElementById('player-score-name');
  playerName.innerText = teams[teamIndex][playerIndex];

  var scoringBox = document.getElementById('scoring-box');
  scoringBox.classList.remove('hidden');
}

var teamSelector = document.getElementById('team-select');
teamSelector.addEventListener('change', getPlayers, once);

function makeActive(event) {
  var previousActive = document.getElementsByClassName('active');
  if (previousActive[0]) {
    previousActive[0].classList.remove('active');
  }

  event.target.classList.add('active');
}

var scoreButtons = document.getElementsByClassName('score-button');
for (var i = 0; i < scoreButtons.length; i++) {
  scoreButtons[i].addEventListener('click', makeActive);
}

function advancePlayers(event) {
  console.log(teams[teamIndex]);
  var active = document.getElementsByClassName('active');
  if (active[0] == undefined) {
    alert("Please select a score");
    return;
  }

  var scoreObject = {
    teamName: teams[teamIndex][0],
    playerName: teams[teamIndex][playerIndex],
    vaultScore: parseFloat(active[0].innerText)
  }

  console.log(scoreObject);

  playerIndex++;
  var playerName = document.getElementById('player-score-name');
  playerName.innerText = teams[teamIndex][playerIndex];

  active[0].classList.remove('active');

  if (playerIndex == 8) {
    var scoringBox = document.getElementById('scoring-box');
    var teamsSelectBox = document.getElementById('team-select-box');
    var scoreComplete = document.getElementById('score-complete-box');

    scoringBox.classList.add('hidden');
    teamsSelectBox.classList.add('hidden');
    scoreComplete.classList.remove('hidden');
  }
}

var acceptButton = document.getElementById('score-accept');
acceptButton.addEventListener('click', advancePlayers);