/*  Love Saroha
    lovesaroha1994@gmail.com (email address)
    https://www.lovesaroha.com (website)
    https://github.com/lovesaroha  (github)
*/

// ProjectObject structure defined.
class ProjectObject {
     constructor(data) {
          this._id = data._id || 0;
          this.token = data.token || this._id;
          this.title = data.title || "new project";
          this.description = data.description || "";
          if (data.createdAt) {
               // Set date if not undefined.
               this.createdAt = new Date(data.createdAt);
          } else {
               this.createdAt = new Date();
          }
          if (data.updatedAt) {
               // Set date if not undefined.
               this.updatedAt = new Date(data.updatedAt);
          } else {
               this.updatedAt = new Date();
          }
          this.tags = data.tags || [];
          this.isDefault = data.isDefault || false;
          if (data.deadline) {
               // Set date if not undefined.
               this.deadline = new Date(data.deadline);
          } else {
               this.deadline = this.createdAt;
          }
          this.data = [];
          this.totalTasks = 0;
          this.tasksCompleted = 0;
          this.completed = false;
          if (data.data) {
               for (let i = 0; i < data.data.length; i++) {
                    // Prepare data object.
                    if (data.data[i].isTask) {
                         // Task data.
                         this.totalTasks++;
                         if (data.data[i].completed) {
                              this.tasksCompleted++;
                         }
                    }
                    this.data.push(new ProjectDataObject(data.data[i]));
               }
          }
          this.completed = findProjectStatus(this);
     }
}

// Project data object structure defined here.
class ProjectDataObject {
     constructor(data) {
          this._id = data._id || 0;
          this.content = data.content || "new task";
          if (data.createdAt) {
               // Set date if not undefined.
               this.createdAt = new Date(data.createdAt);
          } else {
               this.createdAt = new Date();
          }
          if (data.completedOn) {
               // Set date if not undefined.
               this.completedOn = new Date(data.completedOn);
          } else {
               this.completedOn = new Date();
          }
          this.completed = data.completed || false;
          if (data.deadline) {
               // Set date if not undefined.
               this.deadline = new Date(data.deadline);
          } else {
               this.deadline = this.createdAt;
          }
          this.isTask = data.isTask || false;
     }
}

// This function return project status based on tasks.
function findProjectStatus(project) {
     return (project.totalTasks > 0 && project.totalTasks == project.tasksCompleted);
}

// This function return given project.
function findProjectByID(id) {
     for (let i = 0; i < projectList.length; i++) {
          if (projectList[i]._id == id) {
               return projectList[i];
          }
     }
     return {};
}

// This function return inbox project.
function findInboxProject() {
     for (let i = 0; i < projectList.length; i++) {
          if (projectList[i].isDefault && projectList[i].title == "Inbox") {
               return projectList[i];
          }
     }
     return {};
}

// This function remove given project by id.
function removeProjectByID(id) {
     for (let i = 0; i < projectList.length; i++) {
          if (projectList[i]._id == id) {
               projectList.splice(i, 1);
               return;
          }
     }
}

// This function return project data by id.
function findProjectDataByID(project, id) {
     for (let i = 0; i < project.data.length; i++) {
          if (project.data[i]._id == id) {
               // Match found.
               return project.data[i];
          }
     }
     return {};
}

// This function remove project data by given id.
function removeProjectDataByID(project, id) {
     for (let i = 0; i < project.data.length; i++) {
          if (project.data[i]._id == id) {
               // Match found.
               if (project.data[i].isTask) {
                    // Task is removed.
                    project.totalTasks--;
                    if (project.data[i].completed) {
                         project.tasksCompleted--;
                    }
                    project.completed = findProjectStatus(project);
               }
               updateDOMClassByID(`${project._id}StatusIcon`, `fad ${project.completed ? 'fa-check-circle' : 'fa-circle'} cursor-move icon-primary`);
               project.data.splice(i, 1);
               return;
          }
     }
}

// This function return given project and data.
function findProjectByDataID(id) {
     for (let i = 0; i < projectList.length; i++) {
          for (let j = 0; j < projectList[i].data.length; j++) {
               if (projectList[i].data[j]._id == id) {
                    // Project found.
                    return projectList[i];
               }
          }
     }
     return {};
}

// This function shows projects in sidebar.
function showSidebar() {
     let template = `<div id="projects_id">`;
     for (let i = 0; i < projectList.length; i++) {
          template += `
          <div class="mb-1 card p-2" data-id="${projectList[i]._id}">
               <h3 class="capitalize font-bold mb-0 truncate">${projectIconTemplate(projectList[i])}
               <span onclick="javascript: window.location = '/#/project?id=${projectList[i]._id}';" class="hover:underline  cursor-pointer">${showText(projectList[i].title)}</span></h3>
          </div>`;
          if (projectList[i].isDefault) {
               // Add logs link.
               template += `
               <div class="mb-1 mt-1 card p-2">
                    <h3 class="mb-0 font-bold">
                         <i class="fad min-w-8 fa-calendar icon-primary"></i>
                         <span class="hover:underline  cursor-pointer" onclick="javascript: window.location = '/#/logs';"> Logs</span>
                    </h3>
               </div>`;
          }
     }
     template += `</div><button  onclick="javascript: showCreateProjectForm();">New Project</button>`;
     updateDOMByID("sidebar", template);
}

// This function return project icon.
function projectIconTemplate(project) {
     if (project.isDefault && project.title == "Inbox") {
          // Inbox project.
          return `<i class="fad fa-inbox icon-primary"></i>`;
     }
     return `<i id="${project._id}StatusIcon_id" class="fad ${project.completed ? 'fa-check-circle' : 'fa-circle'} icon-primary"></i>`;
}

// This function shows project view.
function showProjectView(project) {
     let projectDataTemplate = prepareProjectDataTemplate(project);
     updateDOMByID(`overview`, `
          <h1 class="font-bold mb-0 capitalize">
               <span class="${project.isDefault ? '' : 'cursor-pointer hover:underline hidden-icon'}" data-id="${project._id}" onclick="javascript: showProjectInfo(this);">
                    <span id="${project._id}Title_id">${showText(project.title)}</span> 
                    <small>
                         <i class="fal fa-pencil hide-on-sm text-body"></i>
                    </small>
               </span> 
               <i class="fal fa-ellipsis-h text-subtitle cursor-pointer" data-id="${project._id}" onclick="javascript: showProjectOptions(this);"></i>
          </h1>
          <h4 class="text-subtitle ${project.isDefault ? 'hidden' : ''} capitalize" id="${project._id}Description_id">${project.description}</h4>
          <div id="${project._id}Tags_id">${projectTagsTemplate(project)}</div>
          <div class="mt-5" id="${project._id}Data_id">${projectDataTemplate}</div>`);
}

// This function prepare project data template.
function prepareProjectDataTemplate(project) {
     if (window.location.hash.includes("project-board")) {
          // Project board is open.
          return prepareProjectDataBoardTemplate(project);
     }
     let projectDataTemplate = `<div class="bg-body project-data-drop" ondrop="javascript: projectDataDropHandler(event);" ondragover="nodeDragoverHandler(event)"></div>`;
     for (let i = 0; i < project.data.length; i++) {
          // Add project data in template.
          if (project.data[i].isTask) {
               projectDataTemplate += `
               <div class="p-1 flex hover:bg-card" data-id="${project.data[i]._id}" id="${project.data[i]._id}_id" ondragend="projectDataDragEndHandler(event);" ondragstart="projectDataDragstartHandler(event)" draggable="true">
                    <input class="option-input mr-3"  id="${project.data[i]._id}TaskCheckbox_id" onchange="javascript: updateTaskStatus(this);" data-project-id="${project._id}" data-id="${project.data[i]._id}" type="checkbox" value="" ${project.data[i].completed ? 'checked' : ''}>
                    <h4 class="capitalize ${project.data[i].completed ? 'line-through text-subtitle' : ''} mb-0 cursor-move" data-project-id="${project._id}" data-id="${project.data[i]._id}" onclick="javascript: showTaskInfo(this);" id="${project.data[i]._id}TaskContent_id">${showText(project.data[i].content)}</h4>
               </div>`;
          } else {
               projectDataTemplate += `
               <div class="mt-5 hover:bg-card" ondragend="projectDataDragEndHandler(event);" ondragstart="projectDataDragstartHandler(event)" draggable="true" id="${project.data[i]._id}_id" data-project-id="${project._id}" data-id="${project.data[i]._id}" onclick="javascript: showHeadingInfo(this);">
                    <h3 class="font-bold capitalize cursor-move underline" id="${project.data[i]._id}HeadingContent_id">${showText(project.data[i].content)}</h3>
               </div>`;
          }
          projectDataTemplate += `<div class="bg-body project-data-drop" ondrop="javascript: projectDataDropHandler(event);" ondragover="nodeDragoverHandler(event)"></div>`;
     }
     return projectDataTemplate;
}

// This function prepare board template.
function prepareProjectDataBoardTemplate(project) {
     let columnsTemplate = [``, ``, ``];
     let lists = [{ content: "Todo", _id: 0, tasks: [] }];
     let listOrder = 0;
     let columns = 0;
     for (let i = 0; i < project.data.length; i++) {
          // Prepare project lists.
          if (project.data[i].isTask) {
               lists[listOrder].tasks.push(project.data[i]);
          } else {
               lists.push({ _id: project.data[i]._id, content: project.data[i].content, tasks: [] });
               listOrder++;
          }
     }
     // Prepare template.
     for (let i = 0; i < lists.length; i++) {
          let tasksTemplate = ``;
          for (let j = 0; j < lists[i].tasks.length; j++) {
               // Prepare tasks template.
               tasksTemplate += `
               <div class="p-2 mb-2 mt-2 bg-light" data-id="${lists[i].tasks[j]._id}" id="${lists[i].tasks[j]._id}_id" ondragend="projectDataDragEndHandler(event);" ondragstart="projectDataDragstartHandler(event)" draggable="true">
                    <h4 class="capitalize text-subtitle mb-0 cursor-move" data-project-id="${project._id}" data-id="${lists[i].tasks[j]._id}" onclick="javascript: showTaskInfo(this);" id="${lists[i].tasks[j]._id}TaskContent_id">${showText(lists[i].tasks[j].content)}</h4>
               </div>
               <div class="bg-body project-data-drop" ondrop="javascript: projectDataDropHandler(event);" ondragover="nodeDragoverHandler(event)"></div>`;
          }
          if (i < lists.length - 1) {
               tasksTemplate += `<div data-id="${lists[i + 1]._id}"></div>`;
          }
          columnsTemplate[columns % 3] += `
          <div class="card p-4 mb-4">
               <h3 class="capitalize font-bold underline">${showText(lists[i].content)}</h3>
               <div class="bg-body project-data-drop" ondrop="javascript: projectDataDropHandler(event);" ondragover="nodeDragoverHandler(event)"></div>
               ${tasksTemplate}
          </div>`;
          columns++;
     }
     let projectDataTemplate = `
     <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>${columnsTemplate[0]}</div>
          <div>${columnsTemplate[1]}</div>
          <div>${columnsTemplate[2]}</div>
     </div>`;
     return projectDataTemplate;
}

// This function shows project options.
function showProjectOptions(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     let switchOption = `<div class="mb-2 card p-2 px-4 cursor-pointer" onclick="javascript:  closeModal(); window.location = '/#/project-board?id=${project._id}';"><h4 class="mb-0"><i class="fal fa-square text-primary"></i> Board View</h4></div>`;
     if (window.location.hash.includes("project-board")) {
          switchOption = `
          <div class="mb-2 card p-2 px-4 cursor-pointer" onclick="javascript: closeModal(); window.location = '/#/project?id=${project._id}';">
               <h4 class="mb-0"><i class="fal fa-bars text-primary"></i> List View</h4>
          </div>`;
     }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-md sm:w-full">
          <h1 class="font-bold capitalize mb-6">${showText(project.title)}</h1>
          <div class="mb-2 card p-2 px-4 cursor-pointer" data-id="${project._id}" onclick="javascript: showCreateTaskForm(this);">
               <h4 class="mb-0"><i class="fal fa-check-circle text-primary"></i> Create Task</h4>
          </div>
          <div class="mb-2 card p-2 px-4 cursor-pointer" data-id="${project._id}" onclick="javascript: showCreateHeadingForm(this);">
               <h4 class="mb-0"><i class="fal fa-bars text-primary"></i> Create Heading</h4>
          </div>
          ${switchOption}
     </div>`);
}

// This function shows project info in modal.
function showProjectInfo(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id || project.isDefault) { return; }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">
          <input type="text" data-id="${project._id}" onchange="javascript: updateProjectTitle(this);" autocomplete="off" class="w-full capitalize mb-2" value="${project.title}" name="title" minlength="2" maxlength="35" placeholder="Title" required>
          <input type="text" data-id="${project._id}" onchange="javascript: updateProjectDescription(this);" autocomplete="off" class="w-full capitalize mb-1" value="${project.description}" name="description" maxlength="255" placeholder="Description"  required>
          <div class="mb-2">
               <div id="${project._id}TagsEdit_id" class="flex flex-wrap">${projectTagsEditTemplate(project)}</div>
               <input type="text" data-id="${project._id}" onchange="javascript: addProjectTag(this);" autocomplete="off" class="w-full mt-1"  minlength="2" maxlength="20" placeholder="New tag.." required>
          </div>
          <div class="mb-2 card flex p-2 px-4">
               <i class="fad fa-calendar hide-on-sm mr-3 fa-3x icon-primary"></i>
               <div class="media-body">
                    <h3 class="font-bold mb-0">Started On</h3>
                    <h4 class="text-subtitle mb-0">${showDateAndTime(project.createdAt)}</h4>
               </div>
          </div>
          <div id="${project._id}ProjectDeadlineStatus_id">${projectDeadlineStatusTemplate(project)}</div>
          <button data-id="${project._id}" onclick="javascript: removeProject(this);">Remove</button>
          <button onclick="javascript: closeModal();" class="sm:hidden">Close</button>
     </div>`);
}

// This function return project edit tags template.
function projectTagsEditTemplate(project) {
     let tags = ``;
     for (let i = 0; i < project.tags.length; i++) {
          tags += `
          <font class="bg-light p-2 mr-1 mb-1 text-primary">
               #${showText(project.tags[i])} 
               <i class="fal fa-times cursor-pointer" data-project-id="${project._id}" data-id="${project.tags[i]}" onclick="javascript: removeProjectTag(this);"></i>
          </font>`;
     }
     return tags;
}

// This function return project tags template.
function projectTagsTemplate(project) {
     let tags = ``;
     for (let i = 0; i < project.tags.length; i++) {
          tags += `<font class="bg-light p-2 m-1 text-subtitle">#${showText(project.tags[i])}</font>`;
     }
     return tags;
}

// This function return project deadline status template.
function projectDeadlineStatusTemplate(project) {
     if (project.completed) {
          // Project is completed.
          return `
          <div class="mb-2 fade-in card p-2 px-4">
               <h3 class="font-bold mb-0">Status</h3>
               <h4 class="text-subtitle">Completed</h4>
          </div>`;
     }
     if (matchDatesAndTime(project.deadline, project.createdAt)) {
          // Deadline not set.
          return `
          <div class="mb-2 fade-in card p-2 px-4">
               <h3 class="font-bold mb-0">Status</h3>
               <h4 class="text-subtitle">Pending</h4>
          </div>
          <input class="w-full mb-2" data-id="${project._id}" placeholder="Set deadline days.." onchange="javascript: updateProjectDeadline(this);">`;
     }
     let daysLeft = daysDifference(project.deadline, new Date());
     let status = `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
     if (daysLeft < 1) {
          status = `Project not completed within deadline`;
     }
     // Deadline set.
     return `
     <div class="mb-2 fade-in flex card p-2 px-4">
          <div>
               <i class="fad fa-clock fa-3x mr-3 icon-primary"></i>
          </div>
          <div class="media-body w-full">
               <h3 class="font-bold mb-0">Deadline</h3>
               <h4 class="text-subtitle">${status}</h4>
          </div>
     </div>
     <input class="w-full mb-2" data-id="${project._id}" placeholder="Change deadline days.." onchange="javascript: updateProjectDeadline(this);">`;
}

// This function shows create project form in modal.
function showCreateProjectForm() {
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">
          <form onsubmit="javascript: createProject(event);">
               <input type="text" autocomplete="off" class="w-full mb-2 capitalize" name="title" minlength="2" maxlength="35" placeholder="Title.." required>
               <input type="text" autocomplete="off" class="w-full capitalize mb-2" name="description" maxlength="255" placeholder="Description..">
               <button type="submit" name="submit">Create</button>
               <button onclick="javascript: closeModal();" class="sm:hidden ">Close</button>
          </form>
     </div>`);
}

// This function shows create task form in modal.
function showCreateTaskForm(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">    
          <form onsubmit="javascript: createTask(event);">
               <input type="text" autocomplete="off" class="w-full capitalize mb-2" name="content" minlength="2" maxlength="255" placeholder="Content.." required>
               <input type="hidden" name="projectid" value="${project._id}">
               <button type="submit" name="submit">Create</button>
               <button onclick="javascript: closeModal();" class="sm:hidden ">Close</button>
          </form>
     </div>`);
}

// This function shows create heading form in modal.
function showCreateHeadingForm(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">
          <form onsubmit="javascript: createHeading(event);">
               <input type="text" autocomplete="off" class="w-full capitalize mb-2" name="content" minlength="2" maxlength="90" placeholder="Content.." required>
               <input type="hidden" name="projectid" value="${project._id}">
               <button type="submit" name="submit">Create</button>
               <button onclick="javascript: closeModal();" class="sm:hidden ">Close</button>
          </form>
     </div>`);
}

// This function shows heading info.
function showHeadingInfo(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let heading = findProjectDataByID(project, el.getAttribute("data-id"));
     if (!heading._id) { return; }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">
          <input data-id="${heading._id}" data-project-id="${project._id}" onchange="javascript: updateHeading(this);" type="text" autocomplete="off" value="${heading.content}" class="w-full capitalize mb-2" name="content" minlength="2" maxlength="90" placeholder="Content" required>
          <div class="mb-2 card p-2 px-4">
               <h3 class="font-bold mb-0">Created On</h3>
               <h4 class="text-subtitle mb-0">${showDateAndTime(heading.createdAt)}</h4>
          </div>
          <button data-id="${heading._id}" data-project-id="${project._id}" onclick="javascript: removeData(this);">Remove</button>
          <button onclick="javascript: closeModal();" class="sm:hidden">Close</button>
     </div>`);
}

// This function shows task info.
function showTaskInfo(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let task = findProjectDataByID(project, el.getAttribute("data-id"));
     if (!task._id) { return; }
     showModal(`
     <div class="bg-modal fade-in modal-content mx-auto mt-10 overflow-hidden p-4 shadow-xl sm:max-w-xl sm:w-full">
          <input type="text" data-id="${task._id}" data-project-id="${project._id}"  onchange="javacript: updateTask(this);" autocomplete="off" value="${task.content}" class="w-full capitalize mb-2" name="content" minlength="2" maxlength="255" placeholder="Content" required>
          <div class="mb-2 card p-2 px-4">
               <h3 class="font-bold mb-0">Created On</h3>
               <h4 class="text-subtitle mb-0">${showDateAndTime(task.createdAt)}</h4>
          </div>
          <div id="${task._id}TaskDeadlineStatus_id">${taskDeadlineStatusTemplate(project, task)}</div>
          <button data-id="${task._id}" data-project-id="${project._id}" onclick="javascript: removeData(this);">Remove</button>
          <button onclick="javascript: closeModal();" class="sm:hidden ">Close</button>
     </div>`);
}

// This function return task status template.
function taskDeadlineStatusTemplate(project, task) {
     if (task.completed) {
          // Task is completed.
          return `
          <div class="mb-2 flex fade-in card p-2 px-4">
          <h4 class="text-subtitle mb-0"><i class="fad fa-check-circle icon-primary"></i> Completed this task (${showDateAndTime(task.completedOn)})</h4>
          </div>`;
     }
     if (matchDatesAndTime(task.deadline, task.createdAt)) {
          // Deadline not set.
          return `
          <div class="mb-2 fade-in card p-2 px-4">
               <h3 class="font-bold mb-0">Status</h3>
               <h4 class="text-subtitle">Pending</h4>
          </div>    
          <input class="w-full capitalize mb-2" data-id="${task._id}" data-project-id="${project._id}" placeholder="Set deadline hours.." onchange="javascript: updateTaskDeadline(this);">`;
     }
     let hoursLeft = hoursDifference(task.deadline, new Date());
     let status = `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} left`;
     if (hoursLeft < 1) {
          status = `Task not completed within deadline`;
     }
     // Deadline set.
     return `
     <div class="mb-2 fade-in flex card p-2 px-4">
          <div>
               <i class="fad fa-clock fa-3x mr-3 icon-primary"></i>
          </div>
          <div class="media-body w-full">
               <h3 class="font-bold mb-0">Deadline</h3>
               <h4 class="text-subtitle">${status}</h4>
          </div>
     </div>  
     <input class="w-full mb-2" data-id="${task._id}" data-project-id="${project._id}" placeholder="Change deadline hours.." onchange="javascript: updateTaskDeadline(this);">`;
}

// This function shows logs data.
function showLogsView() {
     let logDates = [];
     let logDatesData = {};
     for (let i = 0; i < projectList.length; i++) {
          // Prepare log data based on dates.
          if (!projectList[i].isDefault) {
               let createdAt = new Date(`${projectList[i].createdAt.getMonth() + 1} ${projectList[i].createdAt.getDate()} ${projectList[i].createdAt.getFullYear()}`);
               let timeStamp = createdAt.getTime();
               if (logDatesData[timeStamp]) {
                    // Add log activity.
                    logDatesData[timeStamp] += projectLogTemplate(projectList[i]);
               } else {
                    // Add new log date.
                    logDatesData[timeStamp] = `<h3 class="font-bold mt-5 underline">${showDate(createdAt)}</h3>
           ${projectLogTemplate(projectList[i])}`;
                    logDates.push(timeStamp);
               }
          }
          for (let j = 0; j < projectList[i].data.length; j++) {
               let createdAt = new Date(`${projectList[i].data[j].createdAt.getMonth() + 1} ${projectList[i].data[j].createdAt.getDate()} ${projectList[i].data[j].createdAt.getFullYear()}`);
               let timeStamp = createdAt.getTime();
               if (logDatesData[timeStamp]) {
                    // Add log activity.
                    logDatesData[timeStamp] += projectDataLogTemplate(projectList[i], projectList[i].data[j]);
               } else {
                    // Add new log date.
                    logDatesData[timeStamp] = `<h3 class="font-bold mt-5 underline">${showDate(createdAt)}</h3>
           ${projectDataLogTemplate(projectList[i], projectList[i].data[j])}`;
                    logDates.push(timeStamp);
               }
          }
     }
     // Sort log dates.
     for (let i = 0; i < logDates.length; i++) {
          for (let j = 0; j < logDates.length - 1; j++) {
               if (logDates[j] > logDates[j + 1]) {
                    // Swap dates.
                    let temp = logDates[j];
                    logDates[j] = logDates[j + 1];
                    logDates[j + 1] = temp;
               }
          }
     }
     if (logDates.length == 0) {
          // No log data to show.
          updateDOMByID(`overview`, `
               <div class="fade-in">
               <div class="mb-2 card flex p-2 mx-auto max-w-md">
               <i class="fad fa-calendar fa-3x icon-primary mr-3"></i>
               <div class="w-full self-center">
               <h3 class="bg-placeholder mb-2 p-2 w-half"></h3>
               <h4 class="bg-placeholder mb-0 p-2"></h4>
               </div>
               </div>
               <div class="mb-2 card flex p-2 mx-auto max-w-sm">
               <i class="fad fa-calendar fa-3x icon-primary mr-3"></i>
               <div class="w-full self-center">
               <h3 class="bg-placeholder mb-2 p-2 w-half"></h3>
               <h4 class="bg-placeholder mb-0 p-2"></h4>
               </div>
               </div>
               <div class="mb-6 card flex p-2 mx-auto max-w-md">
               <i class="fad fa-calendar fa-3x icon-primary mr-3"></i>
               <div class="w-full self-center">
               <h3 class="bg-placeholder mb-2 p-2 w-half"></h3>
               <h4 class="bg-placeholder mb-0 p-2"></h4>
               </div>
               </div>
               <center>
                    <h1 class="font-bold mb-0">You don't have any project or tasks created yet</h1>
                    <h4 class="text-subtitle">Fortunately, it's very easy to create one.</h4>
                    <button onclick="javascript: window.location = '/#/';">Go To Inbox</button>
               </center>
          </div>`);
          return;
     }
     // Prepare template.
     let template = ``;
     for (let i = 0; i < logDates.length; i++) {
          template += logDatesData[logDates[i]];
     }
     updateDOMByID(`overview`, `<div class="fade-in"><h1 class="font-bold mb-6">Logs</h1>${template}</div>`);
}

// This function return project log template.
function projectLogTemplate(project) {
     return `
          <div class="card p-2 mb-2 cursor-pointer" onclick="javascript: window.location = '/#/project?id=${project._id}';">
               <h4 class="mb-0">Created a project 
                    <font class="capitalize bg-light px-4">${showText(project.title)}</font>
               </h4>
          </div>`;
}

// This function return project data log template.
function projectDataLogTemplate(project, data) {
     if (data.isTask) {
          // Task log template.
          return `
          <div class="card p-2 mb-2 cursor-pointer" onclick="javascript: window.location = '/#/project?id=${project._id}';">
               <h4 class="mb-0">Created a task 
                    <font class="bg-light px-4 capitalize">${showText(data.content)}</font>
               </h4>
          </div>`;
     } else {
          // Heading log template.
          return `
          <div class="card p-2 mb-2 cursor-pointer" onclick="javascript: window.location = '/#/project?id=${project._id}';">
               <h4 class="mb-0">Created a heading 
                    <font class="bg-light px-4 capitalize">${showText(data.content)}</font>
               </h4>
          </div>`;
     }
}

// This function prepares project data drag start event.
function projectDataDragstartHandler(e) {
     e.dataTransfer.setData("text/plain", e.target.getAttribute("data-id"));
     e.dataTransfer.dropEffect = "move";
     e.currentTarget.style.opacity = '1.0';
     document.querySelectorAll(`.project-data-drop`).forEach(el => {
          el.style = "min-height: 15px;";
     });
}

// This function handle project data drag end.
function projectDataDragEndHandler(e) {
     e.preventDefault();
     document.querySelectorAll(`.project-data-drop`).forEach(el => {
          el.style = "height: 0px;";
     });
}

// This function handle project data drop.
function projectDataDropHandler(e) {
     e.preventDefault();
     let dataID = e.dataTransfer.getData("text/plain");
     let nextElement = e.target.nextElementSibling;
     let nextID = -1;
     if (nextElement != null) {
          // Next element is same.
          nextID = nextElement.getAttribute("data-id");
          if (nextID == dataID) { return; }
     }
     let previousElement = e.target.previousElementSibling;
     if (previousElement != null) {
          // Previous element is same.
          if (previousElement.getAttribute("data-id") == dataID) { return; }
     }
     updateProjectDataOrder(dataID, nextID);
}

// This function handle node drag over event.
function nodeDragoverHandler(e) {
     e.preventDefault();
     e.dataTransfer.dropEffect = "move";
}


// Send get request to /api/get-projects to get list of projects.
function getProjects() {
     return fetch(`/api/get-projects`, {
          method: 'get',
          headers: {
               "Content-type": "application/json; charset=UTF-8"
          }
     }).then(response => response.json()).then(json => {
          projectList = [];
          for (let i = 0; i < json.length; i++) {
               projectList.push(new ProjectObject(json[i]));
          }
     });
}

// Send post request to /api/create-project and create new project.
function createProject(e) {
     let form = getFormElement(e);
     fetch(`/api/create-project`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8"
          },
          body: `{"title" : "${form.title.value}", "description" : "${form.description.value}"}`
     }).then(response => response.json()).then(json => {
          // Add new project in list.
          projectList.push(new ProjectObject(json))
          showSidebar();
          closeModal();
          window.location = `/#/project?id=${json._id}`;
     });
}

// Send get request to /api/remove-project and remove given project from list.
function removeProject(el) {
     let project = findProjectByID(el.getAttribute("data-id"))
     if (!project._id) { return; }
     // Remove given project from the list.
     removeProjectByID(project._id);
     closeModal();
     fetch(`/api/remove-project`, {
          method: 'get',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          }
     }).catch(e => { console.log(e); });
     if (window.location.hash.includes(project._id)) {
          // Project page is open.
          window.location = "/#/";
          return;
     }
     showSidebar();
     closeModal();
}

// Send post request to /api/update-project and update project details.
function updateProjectTitle(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     if (el.value.length < 2 || el.value.length > 35) { return; }
     // Update project details in list.
     project.title = el.value;
     updateDOMTextByID(`${project._id}Title`, project.title);
     updateDOMTextByID(`${project._id}Description`, project.description);
     showSidebar();
     fetch(`/api/update-project`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"title" : "${project.title}", "description" : "${project.description}" , "tags" : ${JSON.stringify(project.tags)}}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-project and update project details.
function updateProjectDescription(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     if (el.value.length > 255) { return; }
     // Update project details in list.
     project.description = el.value;
     updateDOMTextByID(`${project._id}Title`, project.title);
     updateDOMTextByID(`${project._id}Description`, project.description);
     showSidebar();
     fetch(`/api/update-project`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"title" : "${project.title}", "description" : "${project.description}" , "tags" : ${JSON.stringify(project.tags)}}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-project and update project details.
function addProjectTag(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     if (el.value.length < 2 || el.value.length > 20) { return; }
     if (project.tags.includes(el.value) || project.tags.length > 9) { return; }
     project.tags.push(el.value);
     el.value = "";
     // Update project details in list.
     updateDOMByID(`${project._id}TagsEdit`, projectTagsEditTemplate(project));
     updateDOMByID(`${project._id}Tags`, projectTagsTemplate(project));
     fetch(`/api/update-project`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"title" : "${project.title}", "description" : "${project.description}" , "tags" : ${JSON.stringify(project.tags)}}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-project and update project details.
function removeProjectTag(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let tag = el.getAttribute("data-id");
     if (!project.tags.includes(tag)) { return; }
     for (let i = 0; i < project.tags.length; i++) {
          if (project.tags[i] == tag) {
               // Remove tag.
               project.tags.splice(i, 1);
               break;
          }
     }
     // Update project details in list.
     updateDOMByID(`${project._id}TagsEdit`, projectTagsEditTemplate(project));
     updateDOMByID(`${project._id}Tags`, projectTagsTemplate(project));
     fetch(`/api/update-project`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"title" : "${project.title}", "description" : "${project.description}" , "tags" : ${JSON.stringify(project.tags)}}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-project-deadline and update project deadline.
function updateProjectDeadline(el) {
     let project = findProjectByID(el.getAttribute("data-id"));
     if (!project._id) { return; }
     let newDeadline = parseInt(el.value);
     if (isNaN(newDeadline) || newDeadline > 500 || newDeadline < 1) { return; }
     newDeadline = parseInt(newDeadline);
     project.deadline = new Date();
     project.deadline.setDate(project.deadline.getDate() + newDeadline);
     let timeStamp = project.deadline.getTime();
     // Change project deadline details.
     updateDOMByID(`${project._id}ProjectDeadlineStatus`, projectDeadlineStatusTemplate(project));
     fetch(`/api/update-project-deadline?deadline=${timeStamp}`, {
          method: 'get',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          }
     }).catch(e => { console.log(e); });
}

// Send post request to /api/create-task and create new task.
function createTask(e) {
     let form = getFormElement(e);
     let project = findProjectByID(form.projectid.value);
     if (!project._id) { return; }
     fetch(`/api/create-task`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"content" : "${form.content.value}"}`
     }).then(response => response.json()).then(json => {
          // Add new task in project.
          let newData = new ProjectDataObject(json);
          project.data.push(newData);
          project.totalTasks++;
          if (!project.isDefault) {
               updateDOMClassByID(`${project._id}StatusIcon`, `fad fa-circle cursor-move icon-primary`);
          }
          if (window.location.hash.includes(project._id) || project.isDefault) {
               // Project is open.
               updateDOMByID(`${project._id}Data`, prepareProjectDataTemplate(project));
          }
          closeModal();
     }).catch(e => { console.log(e); });
}

// Send post request to /api/create-heading and create new heading.
function createHeading(e) {
     let form = getFormElement(e);
     let project = findProjectByID(form.projectid.value);
     if (!project._id) { return; }
     fetch(`/api/create-heading`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"content" : "${form.content.value}"}`
     }).then(response => response.json()).then(json => {
          // Add new heading in project.
          let newData = new ProjectDataObject(json);
          project.data.push(newData);
          if (window.location.hash.includes(project._id) || project.isDefault) {
               // Project is open.
               updateDOMByID(`${project._id}Data`, prepareProjectDataTemplate(project));
          }
          closeModal();
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-heading and update heading info.
function updateHeading(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let id = el.getAttribute("data-id");
     if (el.value.length < 2 || el.value.length > 90) { return; }
     // Change heading details.
     let heading = findProjectDataByID(project, id);
     if (!heading._id) { return; }
     heading.content = el.value;
     updateDOMTextByID(`${heading._id}HeadingContent`, heading.content);
     closeModal();
     fetch(`/api/update-heading`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"_id": "${id}", "content" : "${el.value}"}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-task and update task info.
function updateTask(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let task = findProjectDataByID(project, el.getAttribute("data-id"));
     if (!task._id) { return; }
     if (el.value.length < 2 || el.value.length > 255) { return; }
     // Change task details.
     task.content = el.value;
     updateDOMTextByID(`${task._id}TaskContent`, task.content);
     closeModal();
     fetch(`/api/update-task`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"_id": "${task._id}", "content" : "${el.value}"}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-task-deadline and update task info.
function updateTaskDeadline(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let task = findProjectDataByID(project, el.getAttribute("data-id"));
     if (!task._id) { return; }
     let newDeadline = parseInt(el.value);
     if (isNaN(newDeadline) || newDeadline > 500 || newDeadline < 1) { return; }
     newDeadline = parseInt(newDeadline);
     task.deadline = new Date();
     task.deadline.setHours(task.deadline.getHours() + newDeadline);
     let timeStamp = task.deadline.getTime();
     // Change task deadline details.
     updateDOMByID(`${task._id}TaskDeadlineStatus`, taskDeadlineStatusTemplate(project, task));
     fetch(`/api/update-task-deadline?deadline=${timeStamp}`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"_id": "${task._id}"}`
     }).catch(e => { console.log(e); });
}

// Send post request to /api/update-task-status and update task status info.
function updateTaskStatus(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let task = findProjectDataByID(project, el.getAttribute("data-id"));
     if (!task._id) { return; }
     task.completed = el.checked;
     if (task.completed) {
          // Update date.
          task.completedOn = new Date();
          task.deadline = task.createdAt;
          addClassToDOMElement(`${task._id}TaskContent`, "line-through");
          addClassToDOMElement(`${task._id}TaskContent`, "text-subtitle");
          project.tasksCompleted++;
          project.completed = findProjectStatus(project);
     } else {
          removeClassFromDOMElement(`${task._id}TaskContent`, "line-through");
          removeClassFromDOMElement(`${task._id}TaskContent`, "text-subtitle");
          project.tasksCompleted--;
          project.completed = false;
     }
     if (!project.isDefault) {
          updateDOMClassByID(`${project._id}StatusIcon`, `fad ${project.completed ? 'fa-check-circle' : 'fa-circle'} cursor-move icon-primary`);
     }
     updateCheckboxByID(`${task._id}TaskCheckbox`, task.completed);
     fetch(`/api/update-task-status`, {
          method: 'post',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          },
          body: `{"_id": "${task._id}", "completed" : ${el.checked}}`
     }).catch(e => { console.log(e); });
}

// Send get request to /api/remove-data and remove given project data.
function removeData(el) {
     let project = findProjectByID(el.getAttribute("data-project-id"));
     if (!project._id) { return; }
     let dataID = el.getAttribute("data-id");
     removeProjectDataByID(project, dataID);
     if (window.location.hash.includes(project._id) || project.isDefault) {
          // Project page is open.
          updateDOMByID(`${project._id}Data`, prepareProjectDataTemplate(project));
     }
     closeModal();
     fetch(`/api/remove-data?dataID=${dataID}`, {
          method: 'get',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          }
     }).catch(e => { console.log(e); });
}

// Send get request to /api/update-data-order and update project data order.
function updateProjectDataOrder(dataID, nextID) {
     let project = findProjectByDataID(dataID);
     if (!project._id) { return; }
     let moveTo = 0;
     if (nextID == -1) {
          // Move to is last.
          moveTo = project.data.length - 1;
     } else {
          let dataOrder = -1;
          // Calculate move to value.
          for (let i = 0; i < project.data.length; i++) {
               if (project.data[i]._id == dataID) {
                    // Data found.
                    dataOrder = i;
                    continue;
               }
               if (project.data[i]._id == nextID) {
                    if (dataOrder == -1) {
                         // Data moved from bottom to top.
                         moveTo = i;
                    } else {
                         // Data moved from top to bottom.
                         moveTo = i - 1;
                    }
                    break;
               }
          }
     }
     let projectData = findProjectDataByID(project, dataID);
     if (!projectData._id) { return; }
     let newOrder = [];
     let dataOrder = -1;
     for (let i = 0; i < project.data.length; i++) {
          if (project.data[i]._id == dataID) {
               // Data found.
               dataOrder = i;
               continue;
          }
          if (i == moveTo) {
               if (dataOrder == -1) {
                    // Data moved from bottom to top.
                    newOrder.push(projectData);
                    newOrder.push(project.data[i]);
               } else {
                    // Data moved from top to bottom.
                    newOrder.push(project.data[i]);
                    newOrder.push(projectData);
               }
          } else {
               newOrder.push(project.data[i]);
          }
     }
     project.data = newOrder;
     if (window.location.hash.includes(project._id) || project.isDefault) {
          // Project page is open.
          updateDOMByID(`${project._id}Data`, prepareProjectDataTemplate(project));
     }
     fetch(`/api/update-data-order?dataID=${dataID}&moveTo=${moveTo}`, {
          method: 'get',
          headers: {
               "Content-type": "application/json; charset=UTF-8",
               "X-Data-Token": project.token
          }
     }).catch(e => { console.log(e); });
}