const listsContainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]');
const todoDisplayContainer = document.querySelector('[data-todo-display-container]');
const todoTitleElement = document.querySelector('[data-todo-title]');
const todoCountElement = document.querySelector('[data-todo-count]');
const todoContainer = document.querySelector('[data-todos]')
const todoTemplate = document.getElementById('todo-template')
const newTodoForm = document.querySelector('[data-new-todo-form]');
const newTodoInput = document.querySelector('[data-new-todo-input]');
const clearCompleteTodosButton = document.querySelector('[data-clear-complete-todos-button]');

let lists = [];
let selectedListId = '';

newListForm.addEventListener('submit', e=> {
    e.preventDefault();
    const listName = newListInput.value;
    if(listName === null || listName === '') return;
    const list = createList(listName);
    newListInput.value = null;
    lists.push(list);
    selectedListId = list.id;
    render();
});

listsContainer.addEventListener('click', e=> {
    if(e.target.tagName.toLowerCase() === 'li') {
        selectedListId = e.target.dataset.listId;
        render();
    }
});

newTodoForm.addEventListener('submit', e=> {
    e.preventDefault();
    const todoName = newTodoInput.value;
    if(todoName === null || todoName === '') return;
    const todo = createTodo(todoName);
    newTodoInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.todos.push(todo);
    render();
});

todoContainer.addEventListener('click', e=> {
    if(e.target.tagName.toLowerCase() === 'input') {
        const selectedList = lists.find(list => list.id === selectedListId);
        const selectedTodo = selectedList.todos.find(todo => todo.id === e.target.id);
        selectedTodo.complete = e.target.checked;
        renderTodoCount(selectedList);
    }
});

clearCompleteTodosButton.addEventListener('click', e=> {
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.todos = selectedList.todos.filter(todo => !todo.complete);
    render();
});

deleteListButton.addEventListener('click', e=> {
    lists = lists.filter(list => list.id !== selectedListId);
    selectedListId = null;
    render();
})

function createList(name) {
    return {
        id: Date.now().toString(),
        name: name,
        todos: []
    }
}

function createTodo(name) {
    return {
        id: Date.now().toString(),
        name: name,
        complete: false
    }
}

function render() {
    clearElement(listsContainer);
    renderLists();

    const selectedList = lists.find(list => list.id === selectedListId);
    if(selectedListId == null) {
        todoDisplayContainer.style.display = 'none';
    } else {
        todoDisplayContainer.style.display = '';
        todoTitleElement.innerText = selectedList.name;
        renderTodoCount(selectedList);
        clearElement(todoContainer);
        renderTodos(selectedList);
    }
}

function renderLists() {
    lists.forEach(list => {
        const listElement = document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText = list.name;
        if(list.id === selectedListId) {
            listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
    });
}

function renderTodos(selectedList) {
    selectedList.todos.forEach(todo => {
        const todoElement = document.importNode(todoTemplate.content, true);
        const checkbox = todoElement.querySelector('input');
        checkbox.id = todo.id;
        checkbox.checked = todo.complete;
        const label = todoElement.querySelector('label');
        label.htmlFor = todo.id;
        label.append(todo.name);
        todoContainer.appendChild(todoElement);
    });
}

function renderTodoCount(selectedList) {
    const incomplete = selectedList.todos.filter(todo => !todo.complete).length;
    const todoString = incomplete === 1 ? "todo" : "todos";
    todoCountElement.innerText = `${incomplete} ${todoString} remaining`;
}

function clearElement(element)  {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
}
  