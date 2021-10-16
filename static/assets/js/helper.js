/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
// All helper functions.
// Color themes defined here.
const themes = [
  {
      normal: "#5468e7",
      dark: "#4c5ed0",
      light: "#98a4f1",
      veryLight: "#eef0fd",
      primaryText: "#ffffff",
      iconSecondary: "#FFD43B"
  }, {
      normal: "#e94c2b",
      dark: "#d24427",
      veryLight: "#fdedea",
      light: "#f29480",
      primaryText: "#ffffff",
      iconSecondary: "#FFD43B"
  }
];

// Choose random color theme.
let colorTheme = themes[Math.floor(Math.random() * themes.length)];

// This function set random color theme.
function setTheme() {
  // Change css values.
  document.documentElement.style.setProperty("--primary", colorTheme.normal);
  document.documentElement.style.setProperty("--primary-very-light", colorTheme.veryLight);
  document.documentElement.style.setProperty("--icon-secondary", colorTheme.iconSecondary);
}

// Set random theme.
setTheme();

// This function checks if email is valid or not.
function isEmail(string) {
  const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (emailRegexp.test(string) == false) {
      return false;
  }
  return true;
}

// This is a showModal function which shows modal based on given options as an argument.  
function showModal(content) {
  let modal = document.getElementById("modal_id");
  if (modal == null) { return; }
  modal.style = "display: block;";
  modal.innerHTML = content;
}

// This is closeModal function which closes modal and remove backdrop from body.
function closeModal() {
  let modal = document.getElementById("modal_id");
  if (modal == null) { return; }
  modal.style = "display: none;";
  modal.innerHTML = ``;
}

// This is closeModal background function which closes modal.
function closeModalBackground(e) {
  if (e.target.id != "modal_id") { return; }
  let modal = document.getElementById("modal_id");
  if (modal == null) { return; }
  modal.style = "display: none;";
  modal.innerHTML = ``;
}

// This function prepare form.
function getFormElement(e) {
     e.preventDefault();
     return e.target;
}

// This function update dom by id.
function updateDOMByID(id, html) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.innerHTML = html;
}

// This function remove dom element.
function removeDOMElement(id) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.remove();
}

// This function update dom text by id.
function updateDOMTextByID(id, text) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.innerText = text;
}

// This function update dom class.
function updateDOMClassByID(id, className) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.className = className;
}

// This function add class to dom elemnt.
function addClassToDOMElement(id, className) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.classList.add(className);
}

// This function remove class from dom elemnt.
function removeClassFromDOMElement(id, className) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.classList.remove(className);
}

// This function sets element attribute value.
function setElementAttribute(id, key, value) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.setAttribute(key, value);
}

// This function update checkbox value.
function updateCheckboxByID(id, checked) {
     let el = document.getElementById(`${id}_id`);
     if (el == null) { return; }
     el.checked = checked;
}

// This function shows text in DOM.
function showText(content) {
     let el = document.createElement("span");
     el.innerText = content;
     return el.innerHTML;
}

// List of all months.
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// This function show given date and time.
function showDateAndTime(date) {
     if (typeof date == "string" || typeof date == "number") {
          // Convert it to date object.
          date = new Date(date);
     }
     let hours = date.getHours();
     let minutes = date.getMinutes();
     let time = "am";
     if (hours > 12) {
          hours -= 12;
          time = "pm";
     }
     if (minutes < 10) { minutes = `0${minutes}`; }
     if (isToday(date)) {
          // Given date is today.
          return `${hours}:${minutes} ${time}`;
     }
     let d = date.getDate();
     let day = `${d}th`;
     let month = months[date.getMonth()];
     let year = date.getFullYear();
     switch (d % 10) {
          // Set day values.
          case 1: {
               day = `${d}st`;
               break;
          }
          case 2: {
               day = `${d}nd`;
               break
          }
          case 3: {
               day = `${d}rd`;
               break;
          }
     }
     if (d > 10 && d < 20) { day = `${d}th`; }
     if (new Date().getFullYear() == year) { year = ""; }
     return `${day} ${month} ${year}`;
}

// This function show date.
function showDate(date) {
     if (typeof date == "string" || typeof date == "number") {
          // Convert it to date object.
          date = new Date(date);
     }
     let d = date.getDate();
     let day = `${d}th`;
     let month = months[date.getMonth()];
     let year = date.getFullYear();
     switch (d % 10) {
          // Set day values.
          case 1: {
               day = `${d}st`;
               break;
          }
          case 2: {
               day = `${d}nd`;
               break
          }
          case 3: {
               day = `${d}rd`;
               break;
          }
     }
     if (d > 10 && d < 20) { day = `${d}th`; }
     if (new Date().getFullYear() == year) { year = ""; }
     return `${day} ${month} ${year}`;
}

// This function checks if given date is today.
function isToday(date) {
     let today = new Date();
     return (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear());
}

// This function matches two given dates.
function matchDates(first, second) {
     return (first.getDate() == second.getDate() && first.getMonth() == second.getMonth() && first.getFullYear() == second.getFullYear())
}

// This function matches date and time.
function matchDatesAndTime(first, second) {
     return (first.getDate() == second.getDate() && first.getMonth() == second.getMonth() && first.getFullYear() == second.getFullYear() && first.getHours() == second.getHours() && first.getMinutes() == second.getMinutes())
}

// This function returns hours difference between dates.
function hoursDifference(dateOne, dateTwo) {
     const _MS_PER_DAY = 1000 * 60 * 60;
     const utc1 = Date.UTC(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate() , dateOne.getHours() , dateOne.getMinutes());
     const utc2 = Date.UTC(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate() , dateTwo.getHours() , dateTwo.getMinutes());
     return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}

// This function returns number of days difference between two dates.
function daysDifference(dateOne, dateTwo) {
     const _MS_PER_DAY = 1000 * 60 * 60 * 24;
     const utc1 = Date.UTC(dateOne.getFullYear(), dateOne.getMonth(), dateOne.getDate());
     const utc2 = Date.UTC(dateTwo.getFullYear(), dateTwo.getMonth(), dateTwo.getDate());
     return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}