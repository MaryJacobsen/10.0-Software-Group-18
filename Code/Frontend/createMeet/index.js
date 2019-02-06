var order = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth"];
function checkIfOpen(button) {
  header = button.parentNode;
  box = header.parentNode;
  content = box.childNodes[3];
  if (button.value == "opened")
    closeForm(button, content);
  else {
    openForm(button, content);
  }
}

function closeForm(button, content) {
  content.classList.add('hidden');
  button.innerText = "open";
  button.value = "closed";
  console.log("closed");
}

function openForm(button, content) {
  content.classList.remove('hidden');
  button.innerText = "hide";
  button.value = "open";
  console.log("opened");
}

var numTeamsBtn = document.getElementById('number-of-teams-button');
numTeamsBtn.addEventListener("click", checkIfOpen(numTeamsBtn));

var nameTeamBtn = document.getElementById('name-team-button');
nameTeamBtn.addEventListener("click", checkIfOpen(nameTeamBtn));
