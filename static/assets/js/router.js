/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/
// All functions related to routing.
let appRoutes = {};

// Initialize router function.
function initializeRouter(e) {
     e.preventDefault();
     let url = window.location.toString().replace(window.location.origin, "").split("?");
     if (url[0] == "/") { url[0] = "/#/"; }
     if (appRoutes[url[0]] == undefined) {
          window.location = "/#/";
          return;
     }
     let urlParameters = {};
     if (url[1] != undefined) {
          // Assign url parameters values.
          let params = url[1].split("&");
          for (let k = 0; k < params.length; k++) {
               let paramsPair = params[k].split("=");
               if (paramsPair.length != 2) { continue; }
               urlParameters[paramsPair[0]] = paramsPair[1];
          }
     }
     // Prepare application.
     document.querySelector(`html`).scrollTop = 0;
     appRoutes[url[0]](urlParameters);
}

// Run router function on page change.
window.addEventListener("load", initializeRouter, false);
window.addEventListener("popstate", initializeRouter, false);
let view = document.getElementById("view_id");

// Home page.
appRoutes["/#/"] = function () {
     view.innerHTML = document.getElementById("projectPageTemplate_id").innerHTML;
     getProjects().then(r => {
          // Show inbox project view.
          let inbox = findInboxProject();
          if (!inbox._id) { return; }
          showSidebar();
          showProjectView(inbox);
     });
}

// Project page.
appRoutes["/#/project"] = function (parameters) {
     view.innerHTML = document.getElementById("projectPageTemplate_id").innerHTML;
     getProjects().then(r => {
          // Find given project.
          let project = findProjectByID(parameters.id);
          if (project.isDefault || project._id == undefined) {
               // Redirect to home.
               window.location = "/#/";
               return;
          }
          showSidebar();
          showProjectView(project);
     }).catch(e => { console.log(e); });
}

// Project page.
appRoutes["/#/project-board"] = function (parameters) {
     view.innerHTML = document.getElementById("projectBoardPageTemplate_id").innerHTML;
     getProjects().then(r => {
          // Find given project.
          let project = findProjectByID(parameters.id);
          if (project._id == undefined) {
               // Redirect to home.
               window.location = "/#/";
               return;
          }
          showProjectView(project);
     }).catch(e => { console.log(e); });
}

// Logs page.
appRoutes["/#/logs"] = function () {
     view.innerHTML = document.getElementById("projectPageTemplate_id").innerHTML;
     getProjects().then(r => {
          showSidebar();
          showLogsView();
     }).catch(e => { console.log(e); });
}