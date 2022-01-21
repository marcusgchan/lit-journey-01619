const tbody = document.querySelector("[data-activity-parent]");
const addActivityBtn = document.querySelector("#add-activity-btn");
const meanBtn = document.querySelector("[data-mean-btn]");
const weightedBtn = document.querySelector("[data-weighted-btn]");
const resultP = document.querySelector("#result");
let numOfActivities = document.querySelectorAll("[data-activity-row]").length;
const INVALID_INPUT_MSG = "Invalid Input!";

addActivityBtn.addEventListener("click", addNewAssignment);
meanBtn.addEventListener("click", handleMeanCalculation);
weightedBtn.addEventListener("click", handleWeighCalculation);

// Add keydown event listener to all input containers initially
(function addKeyDownEventToDataRow() {
  const rows = document.querySelectorAll("[data-activity-row]");
  rows.forEach((row) => {
    row.addEventListener("keyup", () => handleKeyup(row));
  });
})();

function handleKeyup(row) {
  const scoreInput = row.querySelector("[data-score-input]");
  const totalInput = row.querySelector("[data-total-input]");
  const percentTd = row.querySelector("[data-percent]");
  const result =
    isValid(scoreInput) &&
    isValid(totalInput) &&
    Number(scoreInput.value) <= Number(totalInput.value) &&
    totalInput.value !== "0"
      ? `${((scoreInput.value / totalInput.value) * 100).toFixed(2)}%`
      : "";
  percentTd.innerText = result;
}

function getGrades() {
  const rows = document.querySelectorAll("[data-activity-row]");
  const grades = [];

  rows.forEach((tr) => {
    const scoreInput = tr.querySelector("[data-score-input]");
    const totalInput = tr.querySelector("[data-total-input");
    const weightInput = tr.querySelector("[data-weight-input]");

    grades.push({
      score: scoreInput,
      total: totalInput,
      weight: weightInput,
    });
  });

  return grades;
}

function isValid(input) {
  // Need to check input.value because Number("") === 0
  const inputValue = Number(input.value);
  return !(input.value === "" || isNaN(inputValue) || inputValue < 0);
}

function validateInput(score, total, weight) {
  const scoreValue = Number(score.value);
  const totalValue = Number(total.value);
  let inputRowIsValid = true;

  // Validate score
  if (!isValid(score) || scoreValue > totalValue) {
    inputRowIsValid = false;
    score.classList.add("invalid-input");
  }

  // Validate total
  if (!isValid(total)) {
    inputRowIsValid = false;
    total.classList.add("invalid-input");
  }

  // Validate weight
  if (weight !== undefined) {
    if (!isValid(weight)) {
      inputRowIsValid = false;
      weight.classList.add("invalid-input");
    }
  }

  return inputRowIsValid;
}

function removeInvalidInputStyles() {
  const inputs = document.querySelectorAll(
    "[data-score-input],[data-total-input],[data-weight-input]"
  );
  inputs.forEach((input) => {
    if (input.classList.contains("invalid-input")) {
      input.classList.remove("invalid-input");
    }
  });
}

function addNewAssignment() {
  const clonedAssignmentTr = document
    .querySelector("[data-activity-row]")
    .cloneNode(true);
  clonedAssignmentTr.addEventListener("keyup", () =>
    handleKeyup(clonedAssignmentTr)
  );
  const tRD = clonedAssignmentTr.querySelectorAll("td");
  const nameTd = tRD[0];
  nameTd.innerText = `Activity ${numOfActivities + 1}`;
  const shortNameTd = tRD[1];
  shortNameTd.innerText = `A${numOfActivities + 1}`;

  // Clear input boxes
  const inputs = clonedAssignmentTr.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  // Clear percent
  const percent = clonedAssignmentTr.querySelector("[data-percent]");
  percent.innerText = "";

  ++numOfActivities;
  tbody.appendChild(clonedAssignmentTr);
}

function handleMeanCalculation() {
  removeInvalidInputStyles();
  const grades = getGrades();
  const calculatedGrades = [];

  for (let i = 0; i < grades.length; ++i) {
    const { score, total } = grades[i];
    if (validateInput(score, total)) {
      calculatedGrades.push(score.value / total.value);
    }
  }

  let calculation = 0;
  for (let i = 0; i < calculatedGrades.length; ++i) {
    calculation += calculatedGrades[i];
  }
  calculation /= calculatedGrades.length;

  resultP.innerText =
    calculatedGrades.length === numOfActivities
      ? `${(calculation * 100).toFixed(2)}%`
      : INVALID_INPUT_MSG;
}

function handleWeighCalculation() {
  removeInvalidInputStyles();
  const grades = getGrades();
  const calculatedGrades = [];
  let weightTotal = 0;

  // Calculate total weight
  grades.forEach(({ weight }) => {
    if (isValid(weight)) {
      weightTotal += Number(weight.value);
    }
  });

  for (let i = 0; i < grades.length; ++i) {
    const { score, total, weight } = grades[i];
    if (validateInput(score, total, weight)) {
      calculatedGrades.push((score.value / total.value) * weight.value);
    }
  }

  let calculation = 0;
  for (let i = 0; i < calculatedGrades.length; ++i) {
    calculation += calculatedGrades[i];
  }

  calculation /= weightTotal;
  resultP.innerText =
    calculatedGrades.length === numOfActivities
      ? `${(calculation * 100).toFixed(2)}%`
      : INVALID_INPUT_MSG;
}
