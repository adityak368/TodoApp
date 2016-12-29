var tasks = [];

function initDummyTasks() {
	for(var i=0;i<4;i++) {
		var t = new Task(i,i);
		if(i==5)
			t.isComplete = true;
		tasks.push(t);
	}

}

function loadTasks(taskArr) {
	taskArr.map(createCard);
}

function createCard(task) {
	var card = document.createElement("div");
	card.className = "card"; 
	card.setAttribute('draggable', true);
	card.id = task.id;
	card.ondragstart = dragged;
	card.ondrop = dropped;
	card.ondragover = allowDrop;
	if(!task.isComplete)
		card.appendChild(getCompleteTaskButton(task));
	card.appendChild(getDeleteTaskButton(task));
	card.appendChild(getTaskStatus(task));
	card.appendChild(getTaskDesciption(task));	
	var content = document.getElementById("content");
	content.appendChild(card);
}

function getCompleteTaskButton (task) {
	var completeButton = document.createElement("button");
	completeButton.className = "complete fa fa-check-circle";
	completeButton.id = task.id;
	completeButton.addEventListener('click', completeTask );
	return completeButton;
}

function getDeleteTaskButton(task) {
	var deleteButton = document.createElement("button");
	deleteButton.className = "delete fa fa-window-close ";
	deleteButton.id = task.id;
	deleteButton.addEventListener('click', deleteTask );
	return deleteButton;
}

function getTaskDesciption(task) {
	var textp = document.createElement("p");
	var text = document.createTextNode(task.description);
	textp.appendChild(text);
	return textp;
}

function getTaskStatus(task) {
	var status = document.createElement("div");
	var statusText;
	if(task.isComplete) {
		statusText = document.createTextNode("Complete");
		status.className = "success"; 
	}
	else {
		statusText = document.createTextNode("Pending");
		status.className = "pending"; 
	}
	status.appendChild(statusText);
	return status;
}


function deleteTask() {
	taskId = this.id;
	tasks.every(function(task, index) {
	    if (task.id==taskId) {
	    	tasks.splice(index,1);
	        return false;
	    }
	    else return true;
	});
	clearContent();
	filterTasks();
}


function completeTask() {
	var taskId = this.id;
	tasks.every(function(task, index) {
	    if (task.id==taskId) {
	    	tasks[index].isComplete = true;
	        return false;
	    }
	    else return true;
	});
	clearContent();
	filterTasks();
}


function filterTasks() {
	clearContent();
	switch(parseInt(document.getElementById("filter").value)) {
		case 0:
			loadTasks(tasks);
		break;
		case 1:
			var result = tasks.filter(function(task) {
					if(task.isComplete) {
						return true;
					}
			});
			loadTasks(result);
		break;
		case 2:
			var result = tasks.filter(function(task) {
					if(!task.isComplete) {
						return true;
					}
			});
			loadTasks(result);
		break;
		default:
			loadTasks();
		break;
	}
}


function clearContent() {
	var content = document.getElementById("content");
	content.innerHTML = "";
}

function addTask() {
	var desc = document.getElementById("taskdescription");
	if(desc.value.trim()) {
		var t = new Task(desc.value, tasks.length);
		tasks.push(t);
		hideTaskPanel();
		filterTasks();
		desc.value = "";
	}
}

function openTaskPanel() {
	document.getElementById("taskAdditionDiv").style.display = "block";
}


function hideTaskPanel() {
	document.getElementById("taskAdditionDiv").style.display = "none";
}

function dragged(ev) {
	ev.dataTransfer.setData("id", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dropped(ev) {
    ev.preventDefault();
    var draggedItemId = ev.dataTransfer.getData("id");
	var dropItemId = this.id;
    var dragIndex = getTaskIndex(draggedItemId);
    var dropIndex = getTaskIndex(dropItemId);
    var task = JSON.parse(JSON.stringify(tasks[dragIndex]));
    tasks.splice(dragIndex,1);
    tasks.splice(dropIndex, 0, task);
    filterTasks();
}


function getTaskIndex(id) {
	for(var i = 0; i<tasks.length;i++) {
		if(tasks[i].id == id) {
			return  i;
		}
	}
}