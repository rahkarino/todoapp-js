const taskName = document.querySelector("#task-name");
const taskCreatedDate = document.querySelector("#date-created");
const taskEditedDate = document.querySelector("#date-edited");
const editBtn = document.querySelector("#edit-task");
const tasks = getSavedTasks();
const taskId = location.hash.substring(1);

const lastEditMessage = (timestamp) =>  `تاریخ ویرایش: ${moment(timestamp).locale('fa').fromNow()}`

const currentTask = tasks.find((item) => {
  return item.id === taskId;
});

taskName.value = currentTask.title;
taskCreatedDate.textContent = `تاریخ ایجاد: ${currentTask.dateCreate}`;
taskEditedDate.textContent = 
        currentTask.dateEdit === 'no edit' 
        ? 
        'تاریخ ویرایش: هنوز ویرایش نشده' 
        : 
        lastEditMessage(currentTask.dateEdit)

editBtn.addEventListener("click", () => {
  if (taskName.value !== "") {
    taskName.style.border = "1px solid gray";
    currentTask.title = taskName.value
    currentTask.dateEdit = moment().valueOf()
    taskEditedDate.textContent = lastEditMessage(currentTask.dateEdit)
    localStorage.setItem("tasks", JSON.stringify(tasks));
    // location.assign('./index.html')
  } else {
    taskName.style.border = "1px solid red";
  }
});


