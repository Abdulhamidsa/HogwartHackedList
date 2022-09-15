"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudent = [];

// The prototype for all students:
const newStudentD = {
  firstname: "",
  lastname: "",
  house: "",
  gender: "",
  isStared: false,
};

function start() {
  console.log("SCRIPT IS LOADED !");
  allBtns();
  loadJSON();
}
function allBtns() {
  //// ALL EVENT LISTENERS BABY /////
  document.querySelectorAll("#sorting [data-action=sort]").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelectorAll("[data-action=filter]").forEach((button) => button.addEventListener("click", selectFilter));
}
async function loadJSON() {
  const response = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
  const jsonData = await response.json();
  // when loaded, prepare data objects
  prepareObjects(jsonData);
  console.log(allStudent);
  /*   document.querySelector(".ass").innerHTML = jsonData.length;
   */
}

function prepareObjects(jsonData) {
  allStudent = jsonData.map(preapareObject);
  // TODO: This might not be the function we want to call first
  displayList(allStudent);
}

function preapareObject(jsonObject) {
  const student = Object.create(newStudentD);
  let nameClean = jsonObject.fullname
    .split(" ")
    .map((element) => element.trim())
    .filter((element) => element !== "")
    .map((element) => element.replaceAll('"', ""))
    .filter((element) => element !== "")
    .map((element) => element.substring(0, 1).toUpperCase() + element.substring(1).toLowerCase());

  let houseCleanD = jsonObject.house
    .split(" ")
    .map((element) => element.trim())
    .filter((element) => element !== "")
    .map((element) => element.substring(0, 1).toUpperCase() + element.substring(1).toLowerCase());

  /*   console.log(student);
   */ student.firstname = nameClean[0];
  student.lastname = nameClean[1];

  student.house = houseCleanD[0];
  student.gender = jsonObject.gender.substring(0, 1).toUpperCase() + jsonObject.gender.substring(1).toLowerCase();
  student.isStared = false;

  return student;
}

////      FILTER DA TING         ////
function selectFilter(ev) {
  const filterType = ev.target.dataset.filter;
  console.log(`the user picked ${filterType}`);

  setFilter(filterType);
}

function setFilter(filterType) {
  settings.filtering = filterType;
  buildList();
}
function buildList() {
  const currentList = filterList(allStudent);
  const sortedList = sortList(currentList);

  displayList(sortedList);
}

function filterList(filteredArray) {
  if (settings.filtering === "Slytherin") {
    filteredArray = allStudent.filter(fromSlytherin);
  } else if (settings.filtering === "Hufflepuff") {
    filteredArray = allStudent.filter(fromHufflepuff);
  } else if (settings.filtering === "Ravenclaw") {
    filteredArray = allStudent.filter(fromRavenclaw);
  } else if (settings.filtering === "Gryffindor") {
    filteredArray = allStudent.filter(fromGryffindor);
  } else if (settings.filtering === "Girl") {
    filteredArray = allStudent.filter(genderIsGirl);
  } else if (settings.filtering === "Boy") {
    filteredArray = allStudent.filter(genderIsBoy);
  }
  return filteredArray;
}

function fromSlytherin(allStudent) {
  return allStudent.house === "Slytherin";
}
function fromHufflepuff(allStudent) {
  return allStudent.house === "Hufflepuff";
}
function fromRavenclaw(allStudent) {
  return allStudent.house === "Ravenclaw";
}
function fromGryffindor(allStudent) {
  return allStudent.house === "Gryffindor";
}
function genderIsGirl(allStudent) {
  return allStudent.gender === "Girl";
}
function genderIsBoy(allStudent) {
  return allStudent.gender === "Boy";
}
/////////////////////////////////////////////
function selectSort(ev) {
  const sortBy = ev.target.dataset.sort;
  const sortDir = ev.target.dataset.sortDirection;

  if (sortDir === "desc") {
    ev.target.dataset.sortDirection = "asc";
  } else {
    ev.target.dataset.sortDirection = "desc";
  }
  console.log(`the user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}
const settings = {
  filtering: "",
  sortBy: "",
  sortDir: "",
};
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = 1;
  } else {
    direction = -1;
  }

  sortedList = sortedList.sort(sortByType);

  function sortByType(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";

  // build a new list
  students.forEach(displaystudent);
}

function displaystudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  clone.querySelector("[data-field=star]").textContent = "☆";
  clone.querySelector("[data-field=star]").addEventListener("click", (ev) => {
    student.isStared = !student.isStared;
    if (student.isStared) {
      ev.target.textContent = "⭐";
    } else {
      ev.target.textContent = "☆";
    }
  });
  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=gender]").textContent = student.gender;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
