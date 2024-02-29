var container = document.getElementById('container');
var word_arr = [];
var currentId = 0;
var test = ['1', '2', '3', '4'];
var test2 = ['5', '6', '7', '8'];
var test3 = ['a', 'b', 'c', 'd'];
var test4 = ['e', 'f', 'g', 'h'];

var connectionArray = [test, test2, test3, test4];

var currentConnections = [];
var randomizerMatrix = [];
var userSelection = [];

newGame();

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

function newGame() {
  for(k = 0; k < 4; k++)
  {
    let temp = getRandomConnection();
    currentConnections.push(temp);
    randomizerMatrix.push(temp);
  }

  pullRandomly = pullFromMatrix(randomizerMatrix);
  for(k = 0; k < 4; k++)
  {
    createButton(pullRandomly());
    createButton(pullRandomly());
    createButton(pullRandomly());
    createButton(pullRandomly());
    var lineBreak = document.createElement('br');
    container.appendChild(lineBreak);
  }
}

function getRandomConnection() {
  let random = Math.random();
  random = Math.floor(random * 4);

  if(arrayAlreadyInArray(connectionArray[random],currentConnections))
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
  if(stringInArray(buttonElement.textContent, userSelection))
  {
    removeString(buttonElement.textContent, userSelection)
    buttonElement.style.backgroundColor = '';
    return;
  }

  if(addString(buttonElement.textContent, userSelection))
    buttonElement.style.backgroundColor = 'lightblue';
}

function stringInArray(txt, ar) {
  for(k = 0; k < 4; k++)
  {
    if(txt == ar[k])
      return true;
  }
  return false;
}

function removeString(txt, ar)
{
  let p = false;
  for(k = 0; k < ar.length; k++)
  {
    if(txt == ar[k])
      p = true;
    if(p && k+1 < ar.length)
      ar[k] = ar[k+1];
    else if(p)
      ar[k] = "NULL";
  }
}

function addString(txt, ar)
{
  for(k = 0; k < ar.length; k++)
  {
    if(ar[k] == "NULL")
    {
      ar[k] = txt;
      return true;
    }
  }
  if(ar.length == 4) return false;
  ar.push(txt);
  return true;
}

function arrayAlreadyInArray(arOne, arTwo)
{
  for(k = 0; k < arTwo.length; k++)
  {
    if(arOne[0] == arTwo[k][0])
      return true;
  }
  return false;
}

function checkConnection()
{
  if(userSelection.length < 4) return;
  for(k = 0; k < 4; k++)
  {
    if(userSelection[k] == "NULL") return;
  }
  
  for(k = 0; k < currentConnections.length; k++)
  {
    if(arraysAreEqual(userSelection, currentConnections[k]))
    {
      connectionSuccess();
      return;
    }
  }

  connectionFailure();
  return;
}

function arraysAreEqual(ar1, ar2)
{
  const sortedArray1 = ar1.slice().sort();
  const sortedArray2 = ar2.slice().sort();
  for(m = 0; m < ar1.length; m++)
  {
    if(sortedArray1[m] !== sortedArray2[m])
      return false;
  }
  return true;
}

function connectionSuccess() 
{
  for(k = 0; k < userSelection.length; k++)
  {
    let a = document.getElementById(userSelection[k]);
    a.style.backgroundColor = 'green';
    a.removeEventListener('click', connectionClicked);
    userSelection[k] = "NULL";
  }
}

function connectionFailure()
{
  console.log('failure');
}

function printAnswers() 
{
  for(k = 0; k < currentConnections.length; k++)
  {
    console.log(currentConnections[k]);
  }
  console.log('sper');
  console.log(userSelection);
}