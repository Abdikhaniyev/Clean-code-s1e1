"use strict";

class TodoItem {
  constructor(todoList, title, status) {
    this.todoList = todoList;
    this.title = title;
    this.status = status;
    this.isEditing = false;
    this.isDeleted = false;
  }

  edit(newTitle) {
    this.title = newTitle;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.todoList.render(todoListContainer);
  }

  render() {
    const isEditing = this.isEditing;
    const status = this.status;

    const item = document.createElement("li");
    item.className =
      status === "active" ? "todo-list__item" : "done-list__item";
    const itemContainer = document.createElement("div");
    itemContainer.className =
      status === "active"
        ? "todo-list__item-container"
        : "done-list__item-container";

    const itemContent = isEditing
      ? document.createElement("input")
      : document.createElement("div");

    itemContent.className =
      status === "active"
        ? isEditing
          ? "todo-list__item-input"
          : "todo-list__item-text"
        : "done-list__item-text";

    if (isEditing) {
      itemContent.value = this.title;
      itemContent.placeholder = isEditing ? "Edit todo" : "";
    } else {
      itemContent.innerText = this.title;
    }

    const itemBtns = document.createElement("div");
    itemBtns.className =
      status === "active" ? "todo-list__item-btns" : "done-list__item-btns";

    const btns = [];
    if (isEditing && status === "active") {
      btns.push({
        className: "todo-list__item-btn todo-list__item-btn--save",
        src: "/assets/save.svg",
        alt: "save",
        action: () => {
          this.edit(itemContent.value);
          this.toggleEdit();
        },
      });
    } else if (!isEditing && status === "active") {
      btns.push(
        {
          className: "todo-list__item-btn todo-list__item-btn--check",
          src: "/assets/check.svg",
          alt: "check",
        },
        {
          className: "todo-list__item-btn todo-list__item-btn--edit",
          src: "/assets/edit.svg",
          alt: "edit",
          action: () => {
            this.toggleEdit();
          },
        },
        {
          className: "todo-list__item-btn todo-list__item-btn--delete",
          src: "/assets/delete.svg",
          alt: "delete",
        }
      );
    } else if (status === "completed") {
      btns.push(
        {
          className: "todo-list__item-btn todo-list__item-btn--uncheck",
          src: "/assets/uncheck.svg",
          alt: "uncheck",
        },
        {
          className: "todo-list__item-btn todo-list__item-btn--edit",
          src: "/assets/edit.svg",
          alt: "edit",
          action: () => {
            this.toggleEdit();
          },
        },
        {
          className: "todo-list__item-btn todo-list__item-btn--delete",
          src: "/assets/delete.svg",
          alt: "delete",
        }
      );
    }

    btns.forEach((btn) => {
      const btnEl = document.createElement("button");
      btnEl.className = "btn " + btn.className;
      const btnImg = document.createElement("img");
      btnImg.src = btn.src;
      btnImg.alt = btn.alt;
      btnImg.className = "todo-list__item-btn-img";
      btnEl.addEventListener("click", () => {
        btn.action();
      });
      btnEl.appendChild(btnImg);
      itemBtns.appendChild(btnEl);
    });

    itemContainer.appendChild(itemContent);
    itemContainer.appendChild(itemBtns);
    item.appendChild(itemContainer);

    return item;
  }
}

class TodoList {
  constructor() {
    this.items = [];
  }

  addItem(title, status = "active") {
    this.items.push(new TodoItem(this, title, status));
  }

  render(container) {
    container.innerHTML = "";
    if (this.items.length === 0) {
      const emptyList = document.createElement("p");
      emptyList.className = "empty-list";
      emptyList.innerText = "Empty";
      container.appendChild(emptyList);
      return;
    } else {
      this.items.forEach((item, index) => {
        container.appendChild(item.render());
      });
    }
  }
}

const todoListContainer = document.querySelector(".todo-list__container");
const doneListContainer = document.querySelector(".done-list__container");

const todoList = new TodoList();

const addTodoInput = document.querySelector(".add-todo__input");
const addTodoBtn = document.querySelector(".add-todo__btn");

const handleAddTodo = () => {
  if (addTodoInput.value === "") {
    return;
  }
  const title = addTodoInput.value;
  todoList.addItem(title);
  todoList.render(todoListContainer);
  addTodoInput.value = "";
};

addTodoBtn.addEventListener("click", () => {
  handleAddTodo();
});

addTodoInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleAddTodo();
  }
});

const activeTodoList = new TodoList();
const activeItems = todoList.items.filter((item) => item.status === "active");
activeTodoList.items = activeItems;
activeTodoList.render(todoListContainer);

const doneTodoList = new TodoList();
const completedItems = todoList.items.filter(
  (item) => item.status === "completed"
);
doneTodoList.items = completedItems;
doneTodoList.render(doneListContainer);
