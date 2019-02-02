function checkIfOpen() {
  var form = document.getElementById('number-of-teams-content');
  if (form.classList.contains('hidden'))
    openForm();
  else {
    closeForm();
  }
}

function closeForm() {
  var form = document.getElementById('number-of-teams-content');
  var button = document.getElementById('number-of-teams-button');
  form.classList.add('hidden');
  button.innerText = "open";
  console.log("closed");
}

function openForm() {
  var form = document.getElementById('number-of-teams-content');
  var button = document.getElementById('number-of-teams-button');
  form.classList.remove('hidden');
  button.innerText = "hide";
  console.log("opened");
}

var numTeamsCloseBtn = document.getElementById('number-of-teams-button');
numTeamsCloseBtn.addEventListener("click", checkIfOpen());
