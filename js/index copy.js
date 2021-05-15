const btnAdd = document.querySelector("#btn-add");
const taskDiv = document.querySelector("#tasks");
const taskTitle = document.querySelector("#task-title");
const taskCategory = document.querySelector("#task-category");
const tableBtn = document.querySelector("#table-btn");
const cardBtn = document.querySelector("#card-btn");
const tableView = document.querySelector("#table");
const cardView = document.querySelector("#card");
const removeTaskModalBody = document.querySelector(".remove-body");
const removeBtn = document.getElementById("btn-remove");
const editBtn = document.getElementById("btn-edit");
const taskTitleEdit = document.getElementById("task-title-edit");
const taskCategoryEdit = document.getElementById("task-category-edit");
const taskEditDate = document.getElementById("task-edit-date");
const taskDoneEdit  = document.getElementById("task-done-edit");
const trNoTask = document.getElementById("no-task");

let taskList = [];

const getSavedTasks = () => {
  const tasks = localStorage.getItem("tasks");
  if (tasks !== "") {
    return JSON.parse(tasks);
  } else return [];
};

const renderDOM = (tasks) => {
  // manageView();

  if (tasks !== null) {
    trNoTask.classList.add('d-none')
    tasks.forEach((task) => {
      addTaskRow(task);
    });
  }
  else {
    trNoTask.classList.add('d-block')
  }
};

const manageView = () => {
  if (
    localStorage.getItem("view") === "" ||
    localStorage.getItem("view") === "table"
  ) {
    localStorage.setItem("view", "table");
    tableBtn.click();
  } else if (localStorage.getItem("view") === "card") {
    localStorage.setItem("view", "card");
    cardBtn.click();
  }
  tableBtn.addEventListener("click", () => {
    tableView.classList.remove("d-none");
    cardView.classList.add("d-none");
    tableBtn.classList.add("active");
    cardBtn.classList.remove("active");
    localStorage.setItem("view", "table");
  });
  cardBtn.addEventListener("click", () => {
    cardView.classList.remove("d-none");
    tableView.classList.add("d-none");
    cardBtn.classList.add("active");
    tableBtn.classList.remove("active");
    localStorage.setItem("view", "card");
  });
};

const addTaskRow = (task) => {
  generateTableRow(task);
  taskList.push({
    id: task.id,
    title: task.title,
    category: task.category,
    dateCreate: task.dateCreate,
    dateEdit: task.dateEdit,
    done: task.done,
  });
};

const generateTableRow = (task) => {
  const tbodyTag = document.querySelector("table tbody");
  const trTag = document.createElement("tr");
  const tdName = document.createElement("td");
  const tdCategory = document.createElement("td");
  const tdDone = document.createElement("td");
  const tdDateCreate = document.createElement("td");
  const tdDateEdit = document.createElement("td");
  const tdAction = document.createElement("td");
  // tbodyTag.innerHTML = ''

  tdName.textContent = task.title;
  tdCategory.textContent = task.category === "personal" ? "شخصی" : "غیر شخصی";
  tdDone.innerHTML = task.done
    ? '<img src="../images/bookmark-check.svg">'
    : '<img src="../images/bookmark-x.svg">';
  tdDateCreate.textContent = task.dateCreate;
  tdDateEdit.textContent =
    task.dateEdit === "no edit"
      ? "تابحال ویرایش نشده"
      : lastEditMessage(task.dateEdit);
  tdAction.innerHTML = `
      <button class="btn btn-sm btn-edit" data-bs-toggle="modal" data-bs-target="#task-edit" data-id="${task.id}"><img src="../images/pencil.svg"> ویرایش</a>
      <button class="btn btn-sm btn-delete" data-bs-toggle="modal" data-bs-target="#task-remove" data-id="${task.id}"><img src="../images/trash.svg"> حذف</button>
      `;
  trTag.appendChild(tdName);
  trTag.appendChild(tdCategory);
  trTag.appendChild(tdDone);
  trTag.appendChild(tdDateCreate);
  trTag.appendChild(tdDateEdit);
  trTag.appendChild(tdAction);
  tbodyTag.appendChild(trTag);

  handleRemove();
  handleEdit();
};

const handleRemove = () => {
  const removeBtns = document.querySelectorAll(".btn-delete");
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const taskId = btn.getAttribute("data-id");
      const selectedTask = taskList.find((item) => {
        return item.id === taskId;
      });
      removeTaskModalBody.textContent = `آیا از حذف تسک "${selectedTask.title}" اطمینان دارید؟`;
      removeBtn.setAttribute("data-id", selectedTask.id);
    });
  });
};

removeBtn.addEventListener("click", () => {
  const taskId = removeBtn.getAttribute("data-id");
  const taskIndex = taskList.findIndex((item) => item.id === taskId);
  taskList.splice(taskIndex, 1);
  saveTaskInLocalStorage(taskList);
  // const tbodyTag = document.querySelector("table tbody");
  // tbodyTag.innerHTML = "";
  // renderDOM(taskList);
});

const handleEdit = () => {
  const editBtns = document.querySelectorAll(".btn-edit");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const taskId = btn.getAttribute("data-id");
      const selectedTask = taskList.find((item) => {
        return item.id === taskId;
      });
      taskTitleEdit.value = selectedTask.title;
      taskCategoryEdit.value = selectedTask.category;
      taskEditDate.textContent = selectedTask.dateEdit === "no edit" ? " هنوز ویرایش نشده" : ` ${lastEditMessage(selectedTask.dateEdit)}`;
      taskDoneEdit.checked = selectedTask.done ? true : false;
      editBtn.setAttribute("data-id", selectedTask.id);
    });
  });
};

editBtn.addEventListener("click", () => {
  const taskId = editBtn.getAttribute("data-id");
  const taskIndex = taskList.findIndex((item) => item.id === taskId);
  taskList[taskIndex].title = taskTitleEdit.value;
  taskList[taskIndex].category = taskCategoryEdit.value;
  taskList[taskIndex].done = taskDoneEdit.checked ? true : false;
  taskList[taskIndex].dateEdit = moment().valueOf();
  saveTaskInLocalStorage(taskList);
  // const tbodyTag = document.querySelector("table tbody");
  // tbodyTag.innerHTML = "";
  // renderDOM(taskList);
});

const lastEditMessage = (timestamp) =>
  `${moment(timestamp).locale("fa").fromNow()}`;

btnAdd.addEventListener("click", () => {
  const taskName = taskTitle.value;
  if (taskName !== "" && taskCategory.value !== "notset") {
    taskCategory.dispatchEvent(new MouseEvent("mouseout"));
    taskTitle.dispatchEvent(new MouseEvent("mouseout"));
    const currentDate = moment().locale("fa").format("DD MMMM YYYY, h:mm:ss");
    let newTask = {
      id: uuidv4(),
      title: taskName,
      category: taskCategory.value,
      dateCreate: currentDate,
      dateEdit: "no edit",
      done: false,
    };
    addTaskRow(newTask);
    saveTaskInLocalStorage(taskList);
    taskTitle.value = "";
    taskCategory.value = "notset";
  } else {
    taskCategory.dispatchEvent(new MouseEvent("mouseover"));
    taskTitle.dispatchEvent(new MouseEvent("mouseover"));
  }
});

const saveTaskInLocalStorage = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

document
  .getElementById("task-remove")
  .addEventListener("show.bs.modal", function (event) {
    // console.log(event.target)
  });

window.addEventListener("DOMContentLoaded", (event) => {
  renderDOM(getSavedTasks());
});

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// update other browser tabs & sync its data
window.addEventListener('storage', function(e) {
  if(e.key === 'tasks') {
      items = JSON.parse(e.newValue)
      renderDOM(items)
  }
})