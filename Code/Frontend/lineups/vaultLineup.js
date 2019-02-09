var teams = [
  ["OSU", "osu1", "osu2", "osu3", "osu4", "osu5", "osu6", "osu7", "osu8"],
  ["UW", "uw1", "uw2", "uw3", "uw4", "uw5", "uw6", "uw7", "uw8"],
  ["UO", "uo1", "uo2", "uo3", "uo4", "uo5", "uo6", "uo7", "uo8"],
  ["UCLA", "ucla1", "ucla2", "ucla3", "ucla4", "ucla5", "ucla6", "ucla7", "ucla8"]
];

let once = {
  once : true
}

var index;

function queryPlayers(event) {
  for (var i = 0; i < teams.length; i++) {
    if(teams[i][0] == event.target.value) {
      index = i;
      break;
    }
  }

  var playerNames = document.getElementsByClassName('player-name');
  for (var i = 0; i < playerNames.length; i++) {
    playerNames[i].innerText = teams[index][i + 1];
  }

  var playerCardBox = document.getElementById('player-card-box');
  playerCardBox.classList.remove('hidden');
}

var teamSelector = document.getElementById('team-select');
teamSelector.addEventListener('change', queryPlayers, once);

function upButton(event) {
  if (!(event.target.value == 0)) {
    var playerNames = document.getElementsByClassName('player-name');

    playerAbove = playerNames[parseInt(event.target.value, 10) - 1];
    playerClicked = playerNames[event.target.value];
    nameAbove = teams[index][event.target.value];
    nameClicked = teams[index][parseInt(event.target.value, 10) + 1];

    playerAbove.innerText = nameClicked;
    playerClicked.innerText = nameAbove;

    teams[index][event.target.value] = nameClicked;
    teams[index][parseInt(event.target.value, 10) + 1] = nameAbove;
    console.log(teams[index][event.target.value]);
    console.log(teams[index][parseInt(event.target.value, 10) + 1]);
  }
}

var upBtns = document.getElementsByClassName('up-button');
for (var i = 0; i < upBtns.length; i++) {
  upBtns[i].addEventListener('click', upButton);
}

function downButton(event) {
  if (!(event.target.value == 7)) {
    var playerNames = document.getElementsByClassName('player-name');

    playerBelow = playerNames[parseInt(event.target.value, 10) + 1];
    playerClicked = playerNames[event.target.value];
    nameBelow = teams[index][parseInt(event.target.value, 10) + 2];
    nameClicked = teams[index][parseInt(event.target.value, 10) + 1];

    playerBelow.innerText = nameClicked;
    playerClicked.innerText = nameBelow;

    teams[index][parseInt(event.target.value, 10) + 2] = nameClicked;
    teams[index][parseInt(event.target.value, 10) + 1] = nameBelow;
    console.log(teams[index][parseInt(event.target.value, 10) + 2]);
    console.log(teams[index][parseInt(event.target.value, 10) + 1]);
  }
}

var downBtns = document.getElementsByClassName('down-button');
for (var i = 0; i < downBtns.length; i++) {
  downBtns[i].addEventListener('click', downButton);
}
