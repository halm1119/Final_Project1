const taskManager = new TaskManager(0);

taskManager.load();
let isError = false;

taskManager.render();

const newTaskForm = document.querySelector("#newTaskForm");

newTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTaskNameInput = document.querySelector("#newTaskNameInput");
  const newTaskDescription = document.querySelector("#newTaskDescription");
  const newTaskAssignedTo = document.querySelector("#newTaskAssignedTo");
  const newTaskDueDate = document.querySelector("#newTaskDueDate");
  const errorElement = document.getElementById("error");
  const messagetoUserElement = document.getElementById("messagetoUser");
  messagetoUserElement.innerText = "";

  let taskmanipulations = false;

  newTaskForm.addEventListener("submit", (e) => {
    let messages = [];
    if (taskmanipulations == false) {
      if (newTaskNameInput.value === "" || newTaskNameInput == null) {
        messages.push("Name is required");
        isError = true;
      }

      if (
        newTaskDescription.value === "" ||
        newTaskDescription.value.length > 20
      ) {
        messages.push(
          "Description is required and not longer than 20 characters"
        );
        isError = true;
      }

      if (newTaskAssignedTo.value === "" && newTaskAssignedTo.value < 3) {
        messages.push("Enter Assignee for Task");
        isError = true;
      }

      if (newTaskDueDate.value === "" || newTaskDueDate.value != number) {
        messages.push("Enter Due Date");
        isError = true;
      }

      if (messages.length > 0) {
        e.preventDefault();
        isError = false;
        errorElement.innerText = messages.join("; ");
      } else {
        isError = true;
      }
    }
  });

  if (isError === false) {
    const name = newTaskNameInput.value;
    const description = newTaskDescription.value;
    const assignedTo = newTaskAssignedTo.value;
    const dueDate = newTaskDueDate.value;
    if (
      name.length > 0 &&
      description.length > 0 &&
      assignedTo.length > 0 &&
      dueDate.length > 0
    ) 
    {
      taskManager.addTask(name, description, assignedTo, dueDate);
      taskmanipulations = true;
      taskManager.save();
      messagetoUserElement.innerText = "Task successfully added!";
      taskManager.render();

      newTaskNameInput.value = "";
      newTaskDescription.value = "";
      newTaskAssignedTo.value = "";
      newTaskDueDate.value = "";
    } else {
      taskmanipulations = false;
    }
  }

  taskManager.render();
});

const tasksList = document.querySelector("#tasksList");

tasksList.addEventListener("click", (event) => {
  if (event.target.classList.contains("done-button")) {
    if (isError === false) {
      const parentTask = event.target.parentElement.parentElement;

      const taskId = Number(parentTask.dataset.taskId);

      const task = taskManager.getTaskById(taskId);

      task.status = "DONE";

      taskManager.save();

      taskManager.render();
    }
  }

  // Check if a "Delete" button was clicked
  if (event.target.classList.contains("delete-button")) {
    if (isError === false) {
      // Get the parent Task
      const parentTask = event.target.parentElement.parentElement;

      // Get the taskId of the parent Task.
      const taskId = Number(parentTask.dataset.taskId);
      taskmanipulations = true;
      // Delete the task
      taskManager.deleteTask(taskId);
      // Save the tasks to localStorage
      taskManager.save();

      // Render the tasks

      taskManager.render();
    }
  }
});
