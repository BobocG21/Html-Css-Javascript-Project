//Problem: user interaction doesn't provide desired results
//Solution: add interactivity so the user can manage daily tasks.

var taskInput = document.getElementById("new-task"); // new-task
var addButton = document.getElementsByTagName("button")[0];//first button
var incompleteTasksHolder = document.getElementById("incomplete-tasks"); //incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks"); //completed-tasks
var lastItem = 0;
//New Task List item

var createNewTaskElement = function(taskString) {
	// create List Item
  var listItem = document.createElement("li");
  // input checkbox
  var checkBox = document.createElement("input");
  // label
  var label = document.createElement("label");
  // input (text)
  var editInput = document.createElement("input");
  // button.edit
  var editButton = document.createElement("button");
  // button.delete
  var deleteButton = document.createElement("button");
  
  //Each element needs modified 
  
  checkBox.type = "checkBox";
  editInput.type = "text";
  
  editButton.innerText = "Edit";
  editButton.className = "edit";
  deleteButton.innerText = "Delete";
  deleteButton.className = "delete";
  
  label.innerText = taskString;
  
  // Each element needs appending
  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

	return listItem;
}


//Add a new task
var addTask = function() {
  console.log("Add Task...");
  //Create a new list item with the text from the #new-task:
  var listItem = createNewTaskElement(taskInput.value);
  //Append listItem to incompleteTaskHolder
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = "";

  listItem.setAttribute('data-id', lastItem);
  lastItem++;
}

//Edit an existing task
var editTask = function() {
    console.log("Edit Task...");
  
var listItem = this.parentNode;
  
var editInput = listItem.querySelector("input[type=text]");
var label = listItem.querySelector("label");
  
var containsClass = listItem.classList.contains("editMode");
  
  
  // if class of the parent is .editMode
  if (containsClass) {
      //Switch from .editMode
      //label text become the input's value
      label.innerText = editInput.value;
  } else {
      //Switch to .editMode
      //input value becomes the labels text
     	editInput.value = label.innerText;
  }
  //Toggle .editMode on the parent 
  listItem.classList.toggle("editMode");

  updateTaskJSON(listItem.getAttribute('data-id'), editInput.value, listItem.childNodes[0].checked);
}

//Delete an existing task
var deleteTask = function () {
    console.log("Delete Task...");
		//Remove the parent list item from the ul
  	var listItem = this.parentNode;
  	var ul = listItem.parentNode;
  
  	ul.removeChild(listItem);
    deleteTaskJSON(listItem.getAttribute('data-id'));
    lastItem--;
}

//Mark a task as complete
var taskCompleted = function() {
   console.log("Task Complete...");
  //When the Checkbox is checked 
  //Append the task list item to the #completed-tasks ul
   var listItem = this.parentNode;
   completedTasksHolder.appendChild(listItem);
   bindTaskEvents(listItem, taskIncomplete);

   updateTaskJSON(listItem.getAttribute('data-id'), listItem.childNodes[1].innerText, 1);
}


//Mark a task as incomplete
var taskIncomplete = function() {
  console.log("Task Incomplete...");
 	//When the checkbox is unchecked appendTo #incomplete-tasks
  var listItem = this.parentNode;
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

console.log(listItem.childNodes);
    updateTaskJSON(listItem.getAttribute('data-id'), listItem.childNodes[1].innerText, 0);
}


var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
  	console.log("Bind List item events");
  	// select listitems chidlren
  	var checkBox = taskListItem.querySelector('input[type="checkbox"]');
    var editButton = taskListItem.querySelector("button.edit");
    var deleteButton = taskListItem.querySelector("button.delete");
		//bind editTask to edit button
  	editButton.onclick = editTask;
		//bind deleteTask to delete button
 		deleteButton.onclick = deleteTask;
		//bind checkBoxEventHandler to checkbox
  	checkBox.onchange = checkBoxEventHandler;
  
}

var getTasksJSON = function(){
fetch("http://localhost:3000/todos", {
        method: 'get'
    }).then(response => response.json()).then(function (data) {
        //console.log(data[0]);
        for(var i=0;i<data.length;i++)
        {
          var listItem = createNewTaskElement(data[i].name);
          if(data[i].completed == 0){
            incompleteTasksHolder.appendChild(listItem);
            bindTaskEvents(incompleteTasksHolder.lastChild, taskCompleted);
          }
          else{
            completedTasksHolder.appendChild(listItem);
            bindTaskEvents(completedTasksHolder.lastChild, taskIncomplete);
            completedTasksHolder.lastChild.childNodes[0].checked = true;
          }
          listItem.setAttribute('data-id', data[i].id);
        }
        lastItem = data[data.length - 1].id;
    }).catch(function (err) {
        console.log(err);
    });
}

var postTaskJSON = function(){
  var newItem = {
    "name":taskInput.value,
    "completed":0
  }
  fetch("http://localhost:3000/todos", {
        method: 'post',
        body: JSON.stringify(newItem), 
        headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json())
    .then(response => addTask())
    .catch(error => console.log('Error:', error));
}

var deleteTaskJSON = function(id){
  fetch("http://localhost:3000/todos/" + id, {
        method: 'delete'
    }).then(response => response.json()).then(function (data) {
        console.log("Deleted from JSON");
    }).catch(function (err) {
        console.log(err);
    });
}

var updateTaskJSON = function(id, newName, completed){
   var editItem = {
    "name":newName,
    "completed":completed,
  }
  fetch("http://localhost:3000/todos/" + id, {
        method: 'put',
        body: JSON.stringify(editItem),
        headers: new Headers({
        'Content-Type': 'application/json'
        })
    }).then(response => response.json()).then(function (data) {
        console.log("Updated to JSON");
    }).catch(function (err) {
        console.log(err);
    });
}


// //cycle over incompleteTaskHolder ul list items
// for (var i = 0; i < incompleteTasksHolder.children.length; i ++) {
//   //bind events to list item's children (taskCompleted)	
//   bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
// }

// //cycle over completedTaskHolder ul list items
// for (var i = 0; i < completedTasksHolder.children.length; i ++) {
//   //bind events to list item's children (taskCompleted)	
//   bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
// }

getTasksJSON();
addButton.addEventListener("click", postTaskJSON); 

//Set the click handler to the addTask function
// addButton.addEventListener("click", addTask); 

  
  
  
  
  
  
  
  