const brands = [
  {
    imageName: "ah",
    brandName: "Ah-Counter",
    description: "Note any overused words or filler sounds used as a crutch by anyone who speaks during the meeting."
  },
  {
    imageName: "grammar",
    brandName: "Grammarian",
    description: "Helps all club members to improve their grammar and vocabulary skills. Introduces the word of the day. Notes down incomplete sentences, mispronunciations, and grammatical mistakes."
  },
  {
    imageName: "timer",
    brandName: "Timer",
    description: "Responsible for monitoring time for each meeting segment and each speaker."
  },
  {
    imageName: "tod",
    brandName: "Toastmaster",
    description: "Work with General Evaluator to ensure all role players know their responsibilities. Introduces speakers during the club meeting."
  },
  {
    imageName: "ttm",
    brandName: "Table Topic Master",
    description: "Helps in training members to quickly organize and express their thoughts in an impromptu setting. Provide members who aren't assigned a speaking role an oppurtunity to speak."
  },
  {
    imageName: "eval",
    brandName: "Evaluator",
    description: "Observe the speeches and leadership roles of club members and offer evaluation of their efforts. Provide objective verbal and written evaluations for speakers."
  },
  {
    imageName: "ge",
    brandName: "General Evaluator",
    description: "Evaluates everything that takes place during the club meeting. Conducts the evaluation portion of the meeting and is responsible for the evaluation team."
  }
];

let correct = 0;
let total = 7;
const totalDraggableItems = 7;
const totalMatchingPairs = 7;

const scoreSection = document.querySelector(".score");
const correctSpan = scoreSection.querySelector(".correct");
const totalSpan = scoreSection.querySelector(".total");
const playAgainBtn = scoreSection.querySelector("#play-again-btn");

const draggableItems = document.querySelector(".draggable-items");
const matchingPairs = document.querySelector(".matching-pairs");
let draggableElements;
let droppableElements;
let name;

getName();
initiateGame();

async function getName() {
  const { value: userName } = await Swal.fire({
    title: 'Enter Your Name',
    input: 'text',
    showCancelButton: false,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!'
      }
    }
  });

  if (userName) {
    Swal.fire(`Good to see you again ${capitalize(userName)}.
              <br>Let's see how well you are at identifying roles!
              <br>Drag Drop the hats to their corresponding box.`);
    document.querySelectorAll("section").forEach((i) => {i.style.opacity = 1;});
    name = capitalize(userName);
    return;
  }
}

function capitalize(e) {
  return e.charAt(0).toUpperCase() + e.slice(1)
}

function initiateGame() {
  const randomDraggableBrands = generateRandomItemsArray(totalDraggableItems, brands);
  const randomDroppableBrands = totalMatchingPairs<totalDraggableItems ? generateRandomItemsArray(totalMatchingPairs, randomDraggableBrands) : randomDraggableBrands;
  const alphabeticallySortedRandomDroppableBrands = [...randomDroppableBrands].sort((a,b) => a.brandName.toLowerCase().localeCompare(b.brandName.toLowerCase()));
  
  // Create "draggable-items" and append to DOM
  for(let i=0; i<randomDraggableBrands.length; i++) {
    draggableItems.insertAdjacentHTML("beforeend", `
      <i class="draggable" draggable="true"><img id="${randomDraggableBrands[i].imageName}" src="images/${randomDraggableBrands[i].imageName}.png">
      <p>${randomDraggableBrands[i].brandName}</p></i>
    `);
  }
  
  // Create "matching-pairs" and append to DOM
  for(let i=0; i<alphabeticallySortedRandomDroppableBrands.length; i++) {
    matchingPairs.insertAdjacentHTML("beforeend", `
      <div class="matching-pair">
        <span class="label">${alphabeticallySortedRandomDroppableBrands[i].description}</span>
        <span class="droppable" data-brand="${alphabeticallySortedRandomDroppableBrands[i].imageName}"></span>
      </div>
    `);
  }
  
  draggableElements = document.querySelectorAll(".draggable");
  droppableElements = document.querySelectorAll(".droppable");
  
  draggableElements.forEach(elem => {
    elem.addEventListener("dragstart", dragStart);
    // elem.addEventListener("drag", drag);
    // elem.addEventListener("dragend", dragEnd);
  });
  
  droppableElements.forEach(elem => {
    elem.addEventListener("dragenter", dragEnter);
    elem.addEventListener("dragover", dragOver);
    elem.addEventListener("dragleave", dragLeave);
    elem.addEventListener("drop", drop);
  });
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function generateRandomItemsArray(n, originalArray) {
  let res = [];
  let clonedArray = [...originalArray];
  if(n>clonedArray.length) n=clonedArray.length;
  for(let i=1; i<=n; i++) {
    const randomIndex = Math.floor(Math.random()*clonedArray.length);
    res.push(clonedArray[randomIndex]);
    clonedArray.splice(randomIndex, 1);
  }
  return res;
}

function dragStart(event) {
  event.dataTransfer.setData("text", event.target.id); // or "text/plain"
}

//Events fired on the drop target

function dragEnter(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.add("droppable-hover");
  }
}

function dragOver(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.preventDefault();
  }
}

function dragLeave(event) {
  if(event.target.classList && event.target.classList.contains("droppable") && !event.target.classList.contains("dropped")) {
    event.target.classList.remove("droppable-hover");
  }
}

function drop(event) {
  event.preventDefault();
  event.target.classList.remove("droppable-hover");
  const draggableElementBrand = event.dataTransfer.getData("text");
  const droppableElementBrand = event.target.getAttribute("data-brand");
  const isCorrectMatching = draggableElementBrand===droppableElementBrand;
  // total++;
  if(isCorrectMatching) {
    const draggableElement = document.getElementById(draggableElementBrand);
    event.target.classList.add("dropped");
    draggableElement.classList.add("dragged");
    draggableElement.setAttribute("draggable", "false");
    // event.target.innerHTML = `<i class="fab fa-${draggableElementBrand}" style="color: ${draggableElement.style.color};"></i>`;
    event.target.innerHTML = `<img class="inside" src="images/${draggableElementBrand}.png">`;
    correct++;  
  }
  scoreSection.style.opacity = 0;
  setTimeout(() => {
    correctSpan.textContent = correct;
    // totalSpan.textContent = total;
    scoreSection.style.opacity = 1;
  }, 200);
  if(correct===Math.min(totalMatchingPairs, totalDraggableItems)) { // Game Over!!
    generateCert();
    playAgainBtn.style.display = "block";
    setTimeout(() => {
      playAgainBtn.classList.add("play-again-btn-entrance");
    }, 200);
  }
}

// Other Event Listeners
playAgainBtn.addEventListener("click", playAgainBtnClick);
function playAgainBtnClick() {
  playAgainBtn.classList.remove("play-again-btn-entrance");
  correct = 0;
  total = 7;
  draggableItems.style.opacity = 0;
  matchingPairs.style.opacity = 0;
  setTimeout(() => {
    scoreSection.style.opacity = 0;
  }, 100);
  setTimeout(() => {
    playAgainBtn.style.display = "none";
    while (draggableItems.firstChild) draggableItems.removeChild(draggableItems.firstChild);
    while (matchingPairs.firstChild) matchingPairs.removeChild(matchingPairs.firstChild);
    initiateGame();
    correctSpan.textContent = correct;
    totalSpan.textContent = total;
    draggableItems.style.opacity = 1;
    matchingPairs.style.opacity = 1;
    scoreSection.style.opacity = 1;
  }, 500);
}

async function generateCert() {
  let obj = ['ah', 'eval', 'ge', 'grammar', 'timer', 'tod', 'ttm'];

  const { value: email } = await Swal.fire({
    title: `Congratulations Toastmaster ${name}`,
    imageUrl: `images/${obj[getRandomInt(6)]}.png`,
    text: 'Share the hat you have won on our yammer page.'
  });
}