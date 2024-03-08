var container = document.getElementById('container');
var word_arr = [];
var currentId = 0;
var chances_remaining = 10000;

var connectionArray = [];

var currentConnections = [];
var randomizerMatrix = [];
var userSelection = [];

class Connection {
  constructor(categoryName, categories, level) {
    this.categoryName = categoryName;
    this.categories = categories;
    this.level = level;
  }
}

parseJson().then(() => {
  newGame();  
})

function createButton(txt) {
  newButton = document.createElement('button');
  newButton.textContent = txt;
  newButton.id = txt;
  currentId++;
  newButton.classList = "connections-buttons";
  newButton.addEventListener('click', connectionClicked);
  container.insertBefore(newButton, container.firstChild);
  word_arr.push(txt);
}

function parseJson() {
  return fetch('connections.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch JSON file");
      }

      return response.json();
    })
    .then(jsonData => {
      jsonData.forEach(entry => {
        entry.answers.forEach(answer => {
          const temp = new Connection(answer.group, answer.members, answer.level);
          connectionArray.push(temp);
        }
        )
      })
    })
    .catch (error => {
      console.log('error', error);
    });
}

function newGame() {
  for (k = 0; k < 4; k++) {
    let temp = getRandomConnection();
    currentConnections.push(temp);
    randomizerMatrix.push(temp.categories);
  }

  pullRandomly = pullFromMatrix(randomizerMatrix);
  for (k = 0; k < 4; k++) {
    createButton(pullRandomly());
    createButton(pullRandomly());
    createButton(pullRandomly());
    createButton(pullRandomly());
  }

  chances_remaining = 10000;
  chances_div = document.getElementById("chances");
  chances_div.innerHTML = "Chances Remaining: " + chances_remaining;
}

function shufflePositions() {
  for (k = 0; k < 4; k++) {
    randomizerMatrix.push(currentConnections[k]);
  }

  let a = document.getElementById("container");
  let b = [];
  let temp_holder = [];
  while(a.firstChild.classList != "connections-buttons")
    temp_holder.push(a.removeChild(a.firstChild));

  while (a.firstChild.classList != "chances-remaining")
      b.push(a.removeChild(a.firstChild));

  shuffleArray(b);
  while (b.length > 0) {
    a.insertBefore(b.pop(), a.firstChild);
  }

  while(temp_holder.length > 0) {
    a.insertBefore(temp_holder.pop(), a.firstChild);
  }
}

function userNewGame() {
  let a = document.getElementById("container");
  while (a.firstChild.classList != "chances-remaining")
    a.removeChild(a.firstChild);

  userSelection = [];
  currentConnections = [];
  randomizerMatrix = [];

  newGame();
}

function getRandomConnection() {
  let random = Math.random();
  random = Math.floor(random * connectionArray.length);
  if (undesiredConnection(connectionArray[random], currentConnections))
    return getRandomConnection();
  else
    return connectionArray[random];
}

function shuffleArray(array) {
  // Fisher-Yates (aka Knuth) Shuffle Algorithm
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function pullFromMatrix(matrix) {
  // Step 1: Flatten the matrix to a single-dimensional array
  const flattenedArray = matrix.flat();

  // Step 2: Shuffle the array randomly
  shuffleArray(flattenedArray);

  // Step 3: Pull elements one by one
  const pulledElements = [];

  function pullNextElement() {
    if (flattenedArray.length > 0) {
      const element = flattenedArray.pop();
      pulledElements.push(element);
      return element;
    } else {
      return null; // All elements have been pulled
    }
  }

  return pullNextElement;
}

function connectionClicked(event) {
  var buttonElement = event.target;
  if (stringInArray(buttonElement.textContent, userSelection)) {
    removeString(buttonElement.textContent, userSelection)
    buttonElement.style.backgroundColor = '';
    return;
  }

  if (addString(buttonElement.textContent, userSelection))
    buttonElement.style.backgroundColor = 'lightblue';
}

function stringInArray(txt, ar) {
  for (k = 0; k < 4; k++) {
    if (txt == ar[k])
      return true;
  }
  return false;
}

function removeString(txt, ar) {
  let p = false;
  for (k = 0; k < ar.length; k++) {
    if (txt == ar[k])
      p = true;
    if (p && k + 1 < ar.length)
      ar[k] = ar[k + 1];
    else if (p)
      ar[k] = "NULL";
  }
}

function addString(txt, ar) {
  for (k = 0; k < ar.length; k++) {
    if (ar[k] == "NULL") {
      ar[k] = txt;
      return true;
    }
  }
  if (ar.length == 4) return false;
  ar.push(txt);
  return true;
}

function undesiredConnection(arOne, arTwo) {
  for (k = 0; k < arTwo.length; k++) {
    if (arOne.categoryName == arTwo[k].categoryName
        || arOne.level == arTwo[k].level)
      return true;
  }
  return false;
}

function checkConnection() {
  if (userSelection.length < 4) return;
  for (k = 0; k < 4; k++) {
    if (userSelection[k] == "NULL") return;
  }

  for (k = 0; k < currentConnections.length; k++) {
    if (arraysAreEqual(userSelection, currentConnections[k].categories)) {
      connectionSuccess(currentConnections[k]);
      return;
    }
  }

  connectionFailure();
  return;
}

function arraysAreEqual(ar1, ar2) {
  const sortedArray1 = ar1.slice().sort();
  const sortedArray2 = ar2.slice().sort();
  for (m = 0; m < ar1.length; m++) {
    if (sortedArray1[m] !== sortedArray2[m])
      return false;
  }
  return true;
}

function connectionSuccess(connection_obj) {
  console.log(connection_obj.categoryName);
  let b = document.getElementById('container');
  for (k = 0; k < userSelection.length; k++) {
    let a = document.getElementById(userSelection[k]);
    b.removeChild(a);
  }
  userSelection = []
  finishedConnection = document.createElement('div');
  finishedConnection.id =  connection_obj.categoryName;
  switch(connection_obj.level) {
    case 0: finishedConnection.classList = "completed-connection a"; break;
    case 1: finishedConnection.classList = "completed-connection b"; break;
    case 2: finishedConnection.classList = "completed-connection c"; break;
    case 3: finishedConnection.classList = "completed-connection d"; break;
    default: finishedConnection.classList = "completed-connection a"; break;
  }
  b.insertBefore(finishedConnection, b.firstChild);
  categoriesDiv1 = document.createElement('h3');
  categoriesDiv1.textContent = connection_obj.categoryName;
  finishedConnection.appendChild(categoriesDiv1);
  categoriesDiv = document.createElement('ol');
  categoriesDiv.textContent = connection_obj.categories;
  categoriesDiv.classList = "small";
  categoriesDiv1.appendChild(categoriesDiv);
}

function connectionFailure() {
  chances_div = document.getElementById("chances");
  chances_remaining--;
  chances_div.innerHTML = "Chances Remaining: " + chances_remaining;
}

function printAnswers() {
  for (k = 0; k < currentConnections.length; k++) {
    console.log(currentConnections[k]);
  }
  console.log('sper');
  console.log(userSelection);
}

function deselectAll() {
  for (k = 0; k < userSelection.length; k++) {
    if (userSelection[k] != "NULL") {
      let a = document.getElementById(userSelection[k]);
      a.style.backgroundColor = '';
      userSelection[k] = "NULL";
    }
  }
}