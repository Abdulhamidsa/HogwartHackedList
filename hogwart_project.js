"use strict";
window.addEventListener("DOMContentLoaded", start);
let allStudent = [];
let bloodType = [];
let expelledStudents = [];
let systemIsHacked = false;
const url1 = "https://petlatkea.dk/2021/hogwarts/students.json";
const url2 = "https://petlatkea.dk/2021/hogwarts/families.json";
////////////////////////// The prototype for all students////////////////////////////
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
  prefect: false,
};
////////////////////////// The prototype for the hacker ////////////////////////////
const addedStudent = {
  firstname: "Abdulhamid",
  middlename: "Mamoun",
  lastname: "Alsaati",
  house: "Slytherin",
  gender: "king",
  image: "./images/students/me.png",
  bloodType: "PURE-BLOOD",
  isSquad: false,
  expeled: false,
};
///////////
function start() {
  console.log("SCRIPT IS FULLY LOADED !");
  allBtns();
  loadJSON();
}
////////////////////////// Load jsons files from the url ////////////////////////////
async function loadJSON() {
  const response2 = await fetch(url2);
  bloodType = await response2.json();
  const response1 = await fetch(url1);
  const studentData = await response1.json();
  prepareObjects(studentData);
  /*   console.log(allStudent);
  console.log(bloodType); */
}
//////////
function prepareObjects(studentData) {
  allStudent = studentData.map(prepareObject);
  buildList();
}
//////////
function buildList() {
  const currentList = filterList(allStudent);
  const sortedList = sortList(currentList);
  displayList(sortedList);
}
////////////////////////// GLOBAL EVENT LISTENERS ////////////////////////////
function allBtns() {
  document.querySelectorAll(".sorting [data-action=sort]").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelectorAll("[data-action=filter]").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelector(".hack").addEventListener("click", hackTheSytem);
  searchBar.addEventListener("keyup", searchingBar);
}
////////////////////////// CREATE THE NEW OPJECT AND CLEAN THE DATA ////////////////////////////

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
    student.image = `./images/${student.lastname.toLowerCase()}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
  }
  if (student.firstname === "Parvati") {
    student.image = `./images/${student.lastname.toLowerCase()}_${student.firstname.toLowerCase()}.png`;
  }
  if (student.firstname === "Justin") {
    student.image = `./images/${student.lastname.toString().substring(6)}_${student.firstname.substring(0, 1).toLowerCase()}.png`;
  }
  student.isSquad = false;
  student.house = houseCleanD[0];
  student.gender = students.gender.substring(0, 1).toUpperCase() + students.gender.substring(1).toLowerCase();
  student.bloodType = getBloodStatus(student);
  student.hackedBloodType = fuckWithBloodTypes(student);
  return student;
}
////////////////////////// CALCULATING BLOODTYPES ////////////////////////////

function getBloodStatus(student) {
  if (bloodType.pure.includes(student.lastname))
    if (bloodType.half.includes(student.lastname)) {
      return "PURE (MIXED with MUGGLES)";
    }
  if (bloodType.pure.includes(student.lastname)) {
    return "PURE-BLOODS";
  } else if (bloodType.half.includes(student.lastname)) {
    return "HALF-BLOODS";
  } else {
    return "MUGGLES";
  }
}
////////////////////////// SEARCHING ////////////////////////////
const searchBar = document.querySelector("#search_bar");

function searchingBar() {
  const searchString = searchBar.value.toLowerCase();
  /*   console.log(searchString);
   */
  const filteredSearch = allStudent.filter((student) => {
    const firstName = student.firstname.toLowerCase().includes(searchString);
    const lastName = student.lastname.toLowerCase().includes(searchString);

    if (firstName == true) {
      return firstName;
    }
    if (lastName == true) {
      return lastName;
    }
  });

  /*   console.log(filteredSearch.length);
   */ if (filteredSearch.length < 1) {
    document.querySelector(".search_error_modal").style.display = "block";
  } else if (filteredSearch.length > 1) {
    document.querySelector(".search_error_modal").style.display = "none";
  }
  displayList(filteredSearch);
}

////////////////////////// FILTERING ////////////////////////////
function selectFilter(ev) {
  const filterType = ev.target.dataset.filter;
  setFilter(filterType);
}
function setFilter(filterType) {
  settings.filtering = filterType;
  buildList();
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
    filteredArray = allStudent.concat(expelledStudents);
  } else if (settings.filtering === "isSquad") {
    filteredArray = allStudent.filter(isSquad);
  } else if (settings.filtering === "isExpeled") {
    filteredArray = expelledStudents.filter(isExpeled);
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
  /*   document.querySelector(".all").textContent = filteredArray.length;
   */
  for (let obj of allStudent) {
    if ((obj = filteredArray)) all++;
    document.querySelector(".all").textContent = " " + all;
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
////////////////////////// SORTING ////////////////////////////
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
  /*   console.log(`the user selected ${sortBy} - ${sortDir}`);
   */ setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  document.querySelector(".live_count").textContent = sortedList.length;
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
// CLEAR THE DISPLAY WHEN CHANGING FILTER //
function displayList(students) {
  // clear the list
  document.querySelector("#list").innerHTML = "";
  // build a new list
  students.forEach(displaystudent);
}
// CREATE THE TEMPLATE AND FETCH THE DATA INSIDE //

function displaystudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);
  clone.querySelector("h2").textContent = student.firstname + " " + student.middlename + " " + student.lastname;
  clone.querySelector("img").src = student.image;

  //////////////// INQ SQUAD ////////////////
  if (student.isSquad === true) {
    clone.querySelector(".isSquad").textContent = "🏅";
    clone.querySelector(".squadMember").textContent = "Remove From Squad";
  } else {
    student.isSquad === false;
  }
  //////////////// EXPELLING ////////////////
  clone.querySelector(".expele").addEventListener("click", (ev) => {
    if (student.firstname !== "Abdulhamid") {
      let studentIndex = allStudent.indexOf(student);
      expelledStudents.push(student);
      allStudent.splice(studentIndex, 1);
      student.isExpeled = !student.isExpeled;
      buildList();
    } else {
      student.isExpeled === false;
      openHackedPopUpReturnBox();
    }
  });
  if (student.isExpeled === true) {
    clone.querySelector("h2").innerHTML = ` IS EXPELLED <svg width="24" height="24"><path d="M5 5 L19 19 M5 19 L19 5" stroke="black" stroke-width="2"/></svg>`;
    clone.querySelector("h2").style.color = "red";
    clone.querySelector(".isSquad").textContent = "";
    clone.querySelector(".expele").textContent = "Is Expelled";
    clone.querySelector(".expele").style.backgroundColor = "grey";
    clone.querySelector(".expele").disabled = true;
    clone.querySelector(".squadMember").disabled = true;
    clone.querySelector(".squadMember").style.cursor = "not-allowed";
    clone.querySelector(".squadMember").style.backgroundColor = "grey";
    clone.querySelector(".expele").style.cursor = "not-allowed";
    clone.querySelector(".prefect_member").style.backgroundColor = "grey";
    clone.querySelector(".prefect_member").style.cursor = "not-allowed";
    clone.querySelector(".prefect_member").style.color = "white";
    clone.querySelector(".prefect_member").disabled = true;
  } else {
    student.isExpeled === false;
  }
  if (student.prefect === true) {
    clone.querySelector(".prefect").textContent = "💫";
    clone.querySelector(".prefect_member").textContent = "Remove Prefect";
  }
  //////////////// PREFECTS ////////////////
  clone.querySelector(".prefect_member").addEventListener("click", clickprefect);
  function clickprefect() {
    if (student.prefect === true) {
      student.prefect = false;
      buildList();
    } else {
      tryToMakePrefect(student);
      buildList();
    }
  }

  if (systemIsHacked === false) {
    clone.querySelector(".squadMember").addEventListener("click", addSquad);

    function addSquad() {
      if (student.house === "Slytherin" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.house === "Slytherin" && student.bloodType === "PURE-BLOODS" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.bloodType === "PURE-BLOODS" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (systemIsHacked === false) {
        openPopUpReturnBox();
      }

      if (student.house === "Slytherin" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.hackedBloodType === "PURE-BLOODS" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.house === "Slytherin" && student.hackedBloodType === "PURE-BLOODS" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (systemIsHacked === true) {
        openPopUpReturnBox();
      }
    }
  }

  if (systemIsHacked === true) {
    if (student.firstname !== "Abdulhamid") {
      clone.querySelector(".dead").classList.remove("hidden");
      student.isExpeled = false;
      student.isSquad = false;
      student.prefect = false;
    }
    clone.querySelector(".squadMember").addEventListener("click", addHackedSquad);
    function addHackedSquad() {
      addHackedSquady();
      removeSquad();
    }
    function addHackedSquady() {
      if (student.house === "Slytherin" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.house === "Slytherin" && student.bloodType === "PURE-BLOODS" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.bloodType === "PURE-BLOODS" && systemIsHacked === false) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (systemIsHacked === false) {
        openPopUpReturnBox();
      }

      if (student.house === "Slytherin" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.hackedBloodType === "PURE-BLOODS" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (student.house === "Slytherin" && student.hackedBloodType === "PURE-BLOODS" && systemIsHacked === true) {
        student.isSquad = !student.isSquad;
        buildList();
      } else if (systemIsHacked === true) {
        openPopUpReturnBox();
      }
    }
    function removeSquad() {
      setTimeout(() => {
        document.querySelectorAll(".isSquad").forEach(function (node) {
          node.textContent = "";
        });
        document.querySelectorAll(".squadMember").forEach(function (node) {
          node.textContent = "Add To Inq Squad";
        });
        closeing();
      }, 1500);
    }
    function closeing() {
      document.querySelector(".squadMember").removeEventListener("click", addHackedSquad);

      student.isSquad = false;
    }
  }
  //////////////// POP UP INFO ////////////////
  clone.querySelector(".student_info").addEventListener("click", () => {
    /*     console.log("clicked");
     */ document.querySelector("#popUp h2").textContent = student.firstname + " " + student.middlename + " " + student.lastname;
    if (systemIsHacked === false) {
      document.querySelector("#popUp .bloodType").textContent = student.bloodType;
    }
    if (systemIsHacked === true) {
      document.querySelector("#popUp .bloodType").textContent = student.hackedBloodType;
    }
    document.querySelector("#popUp .firstName").textContent = student.firstname;
    if (student.middlename) {
      document.querySelector("#popUp .middleName").textContent = student.middlename;
    } else {
      document.querySelector("#popUp .middleName").textContent = "(NOT AVAILABLE)";
    }
    document.querySelector("#popUp .lastName").textContent = student.lastname;
    document.querySelector("#popUp .house").textContent = student.house;

    if (systemIsHacked === false) {
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
    } else if (systemIsHacked === true) {
      document.querySelector("#popUp").style.backgroundColor = "black";
      document.querySelectorAll(".house_logo").forEach((image) => {
        image.src = "./images/website_imgs/skeleton.png";
      });
      document.querySelector(".popUp_info").style.color = "white";

      document.querySelectorAll("#popUp p").forEach((border) => {
        border.style.border = "0.5px solid white";
      });
    }

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
    if (student.prefect === true) {
      document.querySelector(".is_prefect").textContent = "Is a member";
    } else {
      document.querySelector(".is_prefect").textContent = "Not a member";
    }
    //////////////// CLOSE POP UP ////////////////
    document.querySelector("#popUp span").addEventListener("click", closePopUP);
  });
  document.querySelector("#list").appendChild(clone);
}

function closePopUP() {
  document.querySelector("#body").style.overflow = "visible";
  document.querySelector("#popUp").style.display = "none";
  document.querySelector("#overlay_body").style.zIndex = "0";
  document.querySelector("#overlay_body").style.opacity = "0";
  document.querySelector("#overlay_body").style.display = "none";
}
document.querySelector(".accept_btn").addEventListener("click", closePopUpReturnBox);
function openPopUpReturnBox() {
  document.querySelector("#body").style.overflow = "hidden";
  document.querySelector("#overlay_body").style.display = "block";
  document.querySelector("#popUp_return_box").style.opacity = "1";
  document.querySelector("#overlay_body").style.opacity = "1";
  document.querySelector("#overlay_body").style.zIndex = "60";
  document.querySelector("#popUp_return_box").style.display = "flex";
  document.querySelector(".accept_btn").textContent = "Understood , Sorry";
  document.querySelector("#popUp_return_box").style.backgroundImage = "url(./images/website_imgs/angry_man.png)";

  document.querySelector("#popUp_return_box p").textContent = "Only Students From Slytherin house and students who hold pure-blood status can be assigned!!!!";
}

function openHackedPopUpReturnBox() {
  document.querySelector("#body").style.overflow = "hidden";
  document.querySelector("#overlay_body").style.display = "block";
  document.querySelector("#popUp_hacked_return_box").style.opacity = "1";
  document.querySelector("#overlay_body").style.opacity = "1";
  document.querySelector("#overlay_body").style.zIndex = "60";
  document.querySelector("#popUp_hacked_return_box").style.display = "flex";
  document.querySelector("#popUp_hacked_return_box p").textContent = "TF YOU THINK YOU ARE DOING???";
  document.querySelector("#popUp_hacked_return_box").style.backgroundImage = "url(./images/website_imgs/angry_police.png)";
  document.querySelector(".accept_hacked_btn").textContent = "SORRY";
  document.querySelector(".accept_hacked_btn").classList.add("blink");

  document.querySelector(".accept_hacked_btn").addEventListener("click", closeHackedPopUpReturnBox);
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
  document.querySelector("#popUp_hacked_return_box").style.opacity = "0";
  document.querySelector("#popUp_hacked_return_box").style.display = "none";
  document.querySelector("#overlay_body").style.zIndex = "0";
  document.querySelector("#overlay_body").style.display = "none";
}

function tryToMakePrefect(selectedStudent) {
  const prefects = allStudent.filter((student) => student.prefect && student.house === selectedStudent.house);
  const numberOfprefects = prefects.length;

  if (numberOfprefects >= 2) {
    removeAorB(prefects[0], prefects[1]);
  } else {
    makeprefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    document.querySelector("#removea").textContent = "Remove" + " " + prefectA.firstname + " ? ";
    document.querySelector("#removeb").textContent = "Remove " + " " + prefectB.firstname + " ? ";
    document.querySelector("#remove_aorb").style.display = "flex";
    document.querySelector("#remove_aorb").style.opacity = "1";
    document.querySelector("#body").style.overflow = "hidden";
    document.querySelector("#overlay_body").style.display = "block";
    document.querySelector("#overlay_body").style.opacity = "1";
    document.querySelector("#overlay_body").style.zIndex = "60";

    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    function closeDialog() {
      document.querySelector("#remove_aorb").style.display = "none";
      document.querySelector("#remove_aorb").style.opacity = "0";

      document.querySelector("#body").style.overflow = "visible";
      document.querySelector("#overlay_body").style.zIndex = "0";
      document.querySelector("#overlay_body").style.display = "none";
      document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);

      document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }
    function clickRemoveA() {
      removeprefect(prefectA);
      makeprefect(selectedStudent);
      buildList();
      closeDialog();
    }
    function clickRemoveB() {
      removeprefect(prefectB);
      makeprefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removeprefect(prefectStudent) {
    prefectStudent.prefect = false;
  }

  function makeprefect(student) {
    student.prefect = true;
  }
}

////////// HACK THE SYSTYM ///////
function hackTheSytem() {
  systemIsHacked = !systemIsHacked;
  addHacker();
  hackingTheBody();
  allStudent.forEach(fuckWithBloodTypes);
}

function addHacker() {
  if (systemIsHacked === systemIsHacked) {
    allStudent.unshift(addedStudent);

    displayList(allStudent);
    buildList();
  }
}
////////////////////////// EDIT THE BLOOD STATUS AFTER THE HACK ////////////////////////////

function fuckWithBloodTypes(student) {
  if (bloodType.pure.includes(student.lastname))
    if (bloodType.half.includes(student.lastname)) {
      student.hackedBloodType = "PURE-BLOODS";
    }
  if (bloodType.pure.includes(student.lastname)) {
    let bloodTypeArray = ["MUGGLE", "PURE-BLOODS", "PURE (MIXED with MUGGLES)"];
    let pickedType = Math.floor(Math.random() * 3);
    student.hackedBloodType = bloodTypeArray[pickedType];
  } else {
    return "PURE-BLOODS";
  }
}
function hackingTheBody() {
  const video = document.querySelector("#video");
  const logo = document.querySelector(".head img");
  document.querySelector(".hack").style.display = "none";
  video.style.display = "block";
  logo.style = "transform: rotate(180deg)";
}
