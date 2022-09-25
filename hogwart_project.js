"use strict";

window.addEventListener("DOMContentLoaded", start);

let allStudent = [];
let bloodType = [];
let expelledStudents = [];
let systemIsHacked = false;

const url1 = "https://petlatkea.dk/2021/hogwarts/students.json";
const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";
// The prototype for all students:
const newStudentD = {
  firstname: "",
  middlename: "",
  lastname: "",
  house: "",
  gender: "",
  image: "",
  bloodType: "",
  isSquad: false,
  isExpeled: false,
};
const addedStudent = {
  firstname: "Abdulhamid",
  middlename: "Mamoun",
  lastname: "Alsaati",
  house: "Your mom's house",
  gender: "king",
  image: "./images/students/me.png",
  bloodType: "clear",
  isSquad: false,
  expeled: true,
};
async function loadJSON() {
  const response2 = await fetch(url2);
  bloodType = await response2.json();
  const response1 = await fetch(url1);
  const studentData = await response1.json();

  prepareObjects(studentData);
  console.log(allStudent);
  console.log(bloodType);
}

function prepareObjects(studentData) {
  allStudent = studentData.map(prepareObject);

  buildList();
}
function start() {
  console.log("SCRIPT IS LOADED !");
  allBtns();
  loadJSON();
}
function allBtns() {
  //// ALL EVENT LISTENERS BABY /////
  document.querySelectorAll("#sorting [data-action=sort]").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelectorAll("[data-action=filter]").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelector(".hack").addEventListener("click", hackTheSytem);
}
function hackTheSytem() {
  systemIsHacked = !systemIsHacked;
  console.log(systemIsHacked);
  addHacker();
  fuckWithInqSquad();
}
console.log(systemIsHacked);

function addHacker() {
  if (systemIsHacked === systemIsHacked) {
    allStudent.unshift(addedStudent);

    displayList(allStudent);
    console.log("a");
  }
  console.log(allStudent);
}

function prepareObject(students) {
  const student = Object.create(newStudentD);

  let nameClean = students.fullname
    .split(" ")
    .map((element) => element.trim())
    .filter((element) => element !== "")
    .map((element) => element.replaceAll('"', ""))

    .filter((element) => element !== "")
    .map((element) => element.substring(0, 1).toUpperCase() + element.substring(1).toLowerCase());

  let houseCleanD = students.house
    .split(" ")
    .map((element) => element.trim())
    .filter((element) => element !== "")
    .map((element) => element.substring(0, 1).toUpperCase() + element.substring(1).toLowerCase());

  student.firstname = nameClean[0];
  if (nameClean.length === 1) {
    student.image = "./images/zabini_b.png";
  }
  if (nameClean.length === 2) {
    student.lastname = nameClean[nameClean.length - 1];
  } else if (nameClean.length === 3) {
    student.lastname = nameClean[nameClean.length - 1];
    student.middlename = nameClean[1];
  }
  if (nameClean.length >= 2) {
    student.image = `./images/${student.lastname}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
  }
  if (student.firstname === "Parvati") {
    student.image = `./images/${student.lastname}_${student.firstname.toLowerCase()}.png`;
  }
  if (student.firstname === "Justin") {
    student.image = `./images/${student.lastname.toString().substring(6)}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
  }
  student.isSquad = false;

  student.house = houseCleanD[0];
  student.gender = students.gender.substring(0, 1).toUpperCase() + students.gender.substring(1).toLowerCase();
  student.bloodType = getBloodStatus(student);

  return student;
}
function fuckWithInqSquad() {}

function getBloodStatus(student) {
  if (bloodType.pure.includes(student.lastname))
    if (bloodType.half.includes(student.lastname)) {
      return "PURE (MIXED / HALF-BLOODS)";
    }
  if (bloodType.pure.includes(student.lastname)) {
    return "PURE-BLOODS";
  } else if (bloodType.half.includes(student.lastname)) {
    return "HALF-BLOODS";
  } else {
    return "MUGGLES";
  }
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
  } else if (settings.filtering === "All") {
    filteredArray = allStudent;
  } else if (settings.filtering === "isSquad") {
    filteredArray = allStudent.filter(isSquad);
  } else if (settings.filtering === "isExpeled") {
    filteredArray = allStudent.filter(isExpeled);
  } else if (settings.filtering === "notExpeled") {
    filteredArray = allStudent.filter(notExpeled);
  }

  /* DISPLAY THE NUMBER OF STUDENTS IN EACH CATEGORIES */
  let gryffindor = 0;
  let slytherin = 0;
  let hufflepuff = 0;
  let girl = 0;
  let boy = 0;
  let notexpeled = 0;
  let expeled = 0;
  let squad = 0;
  let all = 0;
  document.querySelector(".all").textContent = filteredArray.length;

  for (let obj of allStudent) {
    if ((obj = filteredArray)) all++;
    /*     document.querySelector(".all").textContent = " " + all;
     */
  }
  for (let obj of allStudent) {
    if (obj.house === "Gryffindor") gryffindor++;
    document.querySelector(".gryffindor").textContent = " " + gryffindor;
  }
  for (let obj of allStudent) {
    if (obj.house === "Slytherin") slytherin++;
    document.querySelector(".slytherin").textContent = " " + slytherin;
  }

  for (let obj of allStudent) {
    if (obj.house === "Hufflepuff") hufflepuff++;
    document.querySelector(".hufflepuff").textContent = " " + hufflepuff;
  }

  for (let obj of allStudent) {
    if (obj.gender === "Girl") girl++;
    document.querySelector(".girl").textContent = " " + girl;
  }

  for (let obj of allStudent) {
    if (obj.gender === "Boy") boy++;
    document.querySelector(".boy").textContent = " " + boy;
  }

  for (let obj of allStudent) {
    if (obj.isSquad === true) squad++;
    document.querySelector(".squad").textContent = " " + squad;
  }
  for (let obj of allStudent) {
    if (obj.isExpeled !== true) notexpeled++;
    document.querySelector(".notExpeled").textContent = " " + notexpeled;
  }

  for (let obj of allStudent) {
    if (obj.isExpeled === true) expeled++;
    document.querySelector(".isExpeled").textContent = " " + expeled;
  }

  /*  for (let obj of allStudent) {
    if (obj.isExpeled !== true) squad++;
    document.querySelector(".notExpeled").textContent = " " + squad;
  } */
  return filteredArray;
}

function fromSlytherin(allStudent) {
  return allStudent.house === "Slytherin" && allStudent.isExpeled !== true;
}
function fromHufflepuff(allStudent) {
  return allStudent.house === "Hufflepuff" && allStudent.isExpeled !== true;
}
function fromRavenclaw(allStudent) {
  return allStudent.house === "Ravenclaw" && allStudent.isExpeled !== true;
}
function fromGryffindor(allStudent) {
  return allStudent.house === "Gryffindor" && allStudent.isExpeled !== true;
}
function genderIsGirl(allStudent) {
  return allStudent.gender === "Girl" && allStudent.isExpeled !== true;
}
function genderIsBoy(allStudent) {
  return allStudent.gender === "Boy" && allStudent.isExpeled !== true;
}
function isSquad(allStudent) {
  return allStudent.isSquad === true && allStudent.isExpeled !== true;
}
function isExpeled(allStudent) {
  return allStudent.isExpeled === true;
}
function notExpeled(allStudent) {
  return allStudent.isExpeled !== true;
}
/////////////////////////////////////////////
const settings = {
  filtering: "All",
  sortBy: "firstname",
  sortDir: "decs",
};
function selectSort(ev) {
  const sortBy = ev.target.dataset.sort;
  const sortDir = ev.target.dataset.sortDirection;
  let oldElement = document.querySelector(`[data-sort="${sortBy}"]`);
  oldElement.classList.remove("sortBy");

  oldElement.classList.add("sortBy");

  if (sortDir === "desc") {
    ev.target.dataset.sortDirection = "asc";
  } else {
    ev.target.dataset.sortDirection = "desc";
  }
  console.log(`the user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

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
  /*   if (systemIsHacked === true) {
    students.push(addedStudent);
  } */
}

function displaystudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);

  if (student.isSquad === true) {
    clone.querySelector(".isSquad").textContent = "🏅";
    clone.querySelector(".squadMember").textContent = "Remove From Squad";
  } else {
    student.isSquad === false;
  }

  if (student.isExpeled === true) {
    clone.querySelector("h2").textContent = "";
    clone.querySelector(".isSquad").textContent = "";
    clone.querySelector(".expele").textContent = "Is Expelled";
    clone.querySelector(".expele").style.backgroundColor = "grey";
    clone.querySelector(".expele").disabled = true;
    clone.querySelector(".squadMember").disabled = true;
    clone.querySelector(".squadMember").style.cursor = "not-allowed";
    clone.querySelector(".squadMember").style.backgroundColor = "grey";

    clone.querySelector(".expele").style.cursor = "not-allowed";
  } else {
    student.isExpeled === false;
  }

  clone.querySelector(".expele").addEventListener("click", (ev) => {
    if (student.firstname !== "Abdulhamid") {
      student.isExpeled = !student.isExpeled;
      buildList();
    } else {
      student.isExpeled === false;
      openHackedPopUpReturnBox();
    }
  });

  clone.querySelector(".squadMember").addEventListener("click", (ev) => {
    if (student.house === "Slytherin") {
      student.isSquad = !student.isSquad;
      buildList();
    } else if (student.house === "Slytherin" && student.bloodType === "PURE-BLOODS") {
      student.isSquad = !student.isSquad;
      buildList();
    } else {
      openPopUpReturnBox();
    }
  });
  /*   clone.querySelector("#container .arrow_up").addEventListener("click", () => {
    
  }); */

  /*   */
  // set clone data
  clone.querySelector("h2").textContent = student.firstname + " " + student.middlename + " " + student.lastname;
  /*   clone.querySelector("[data-field=middlename]").textContent = student.middlename;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
 */ clone.querySelector("img").src = student.image;

  clone.querySelector("#container .student_info").addEventListener("click", () => {
    console.log("clicked");
    document.querySelector("#popUp h2").textContent = student.firstname + " " + student.middlename + " " + student.lastname;
    document.querySelector("#popUp .bloodType").textContent = student.bloodType;

    document.querySelector("#popUp .firstName").textContent = student.firstname;
    if (student.middlename) {
      document.querySelector("#popUp .middleName").textContent = student.middlename;
    } else {
      document.querySelector("#popUp .middleName").textContent = "(NOT AVAILABLE)";
    }
    document.querySelector("#popUp .lastName").textContent = student.lastname;
    document.querySelector("#popUp .house").textContent = student.house;

    document.querySelectorAll(".house_logo").forEach((image) => {
      if (student.house === "Ravenclaw") {
        image.src = "./images/website_imgs/ravenclaw_house_logo.png";
        document.querySelector("#popUp").style.background = "#1f3d4d";
      } else if (student.house === "Slytherin") {
        document.querySelector("#popUp").style.background = "#264426";
        image.src = "./images/website_imgs/slytherin_house_logo.png";
      } else if (student.house === "Gryffindor") {
        document.querySelector("#popUp").style.background = "#532323";
        document.querySelector("#popUp p").style.color = "white";

        image.src = "./images/website_imgs/gryffindor_house_logo.png";
      } else if (student.house === "Hufflepuff") {
        image.src = "./images/website_imgs/hufflepuff_house_logo.png";
        document.querySelector("#popUp").style.background = "#b89e40";
      }
    });

    /*       document.querySelector(".house_logo").src = "./images/website_imgs/slytherin_house_logo.png";
     */

    document.querySelector("#popUp .student_img").src = student.image;
    document.querySelector("#body").style.overflow = "hidden";
    document.querySelector("#overlay_body").style.display = "block";

    document.querySelector("#overlay_body").style.opacity = "1";
    document.querySelector("#overlay_body").style.zIndex = "60";
    document.querySelector("#popUp").style.display = "flex";

    if (student.isSquad === true) {
      document.querySelector(".isSquadMember").textContent = "Is A Member";
    } else {
      document.querySelector(".isSquadMember").textContent = "Not A Member";
    }

    if (student.isExpeled === true) {
      document.querySelector(".is_expeled").textContent = "Is Expelled";
    } else {
      document.querySelector(".is_expeled").textContent = "Enrolled";
    }
    //////close popup//////
    document.querySelector("#popUp span").addEventListener("click", closePopUP);

    ////////
    /*     document.querySelector(".model").style.display = "flex";
    document.querySelector("article").style.opacity = "0.5";
    document.querySelector("article").style.pointerEvents = "none"; */
    ////////
  });

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

function expele() {
  document.querySelector(".expele").textContent = "ahh";
  student.isExpeled === true;

  /*   allStudent.shift(expelledStudents);

  console.log(allStudent);
  console.log(expelledStudents); */
}

function remove() {
  console.log("hmmm");
}
document.querySelector(".accept_btn").addEventListener("click", closePopUpReturnBox);
function fuck() {
  console.error("ahhh");
}
function closePopUP() {
  document.querySelector("#body").style.overflow = "visible";
  document.querySelector("#popUp").style.display = "none";
  document.querySelector("#overlay_body").style.zIndex = "0";
  document.querySelector("#overlay_body").style.opacity = "0";
  document.querySelector("#overlay_body").style.display = "none";
}
function openPopUpReturnBox() {
  document.querySelector("#body").style.overflow = "hidden";
  document.querySelector("#overlay_body").style.display = "block";
  document.querySelector("#popUp_return_box").style.opacity = "1";
  document.querySelector("#overlay_body").style.opacity = "1";
  document.querySelector("#overlay_body").style.zIndex = "60";
  document.querySelector("#popUp_return_box").style.display = "flex";
  document.querySelector(".accept_btn").textContent = "Understood , Sorry";
  document.querySelector("#popUp_return_box p").textContent = "Only Students From Slytherin house and students who hold pure-blood status can be assigned!!!!";
}

function openHackedPopUpReturnBox() {
  document.querySelector("#body").style.overflow = "hidden";
  document.querySelector("#overlay_body").style.display = "block";
  document.querySelector("#popUp_return_box").style.opacity = "1";
  document.querySelector("#overlay_body").style.opacity = "1";
  document.querySelector("#overlay_body").style.zIndex = "60";
  document.querySelector("#popUp_return_box").style.display = "flex";
  document.querySelector("#popUp_hacked_return_box p").textContent = "TF YOU THINK YOU ARE DOING???";
  document.querySelector("#popUp_hacked_return_box").style.backgroundImage = "url(/images/website_imgs/angry_police.png)";

  document.querySelector(".accept_btn").textContent = "SORRY";
}

function closePopUpReturnBox() {
  document.querySelector("#body").style.overflow = "visible";
  document.querySelector("#popUp_return_box").style.opacity = "0";
  document.querySelector("#popUp_return_box").style.display = "none";
  document.querySelector("#overlay_body").style.zIndex = "0";
  document.querySelector("#overlay_body").style.display = "none";
}

function closeHackedPopUpReturnBox() {
  document.querySelector("#body").style.overflow = "visible";
  document.querySelector("#popUp_return_box").style.opacity = "0";
  document.querySelector("#popUp_return_box").style.display = "none";
  document.querySelector("#overlay_body").style.zIndex = "0";
  document.querySelector("#overlay_body").style.display = "none";
}

function disableBtn() {
  /*   document.querySelector(".squadMember").textContent = "Can't assigned";
  document.querySelector(".squadMember").style.backgroundColor = "Grey";
  document.querySelector(".squadMember").disabled = true;
  document.querySelector(".squadMember").style.cursor = "default"; */
}
