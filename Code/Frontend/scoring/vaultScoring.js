var teams = [
  ["OSU", "osu1", "osu2", "osu3", "osu4", "osu5", "osu6", "osu7", "osu8"],
  ["UW", "uw1", "uw2", "uw3", "uw4", "uw5", "uw6", "uw7", "uw8"],
  ["UO", "uo1", "uo2", "uo3", "uo4", "uo5", "uo6", "uo7", "uo8"],
  ["UCLA", "ucla1", "ucla2", "ucla3", "ucla4", "ucla5", "ucla6", "ucla7", "ucla8"]
];

let once = {
  once : true
}

function getPlayers(event) {

}

var teamSelector = document.getElementsByID('team-select');
teamSelector.addEventListener('change', getPlayers, once);
