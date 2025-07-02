const todos = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'save-todo';
const DATA_KEY = 'SAVED_DATA';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu outdated!');
        return false;
    } else {
        return true;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadDataFromStorage();
    const formulir = document.getElementById('form');
    formulir.addEventListener('submit', function (e) {
        e.preventDefault();
        addTodo();
    });
});

function addTodo() {
    const tugas = document.getElementById('title').value;
    const tanggal = document.getElementById('date').value;


    const tugasID = generateId();
    const objekTugas = generateTodoObject(tugasID, tugas, tanggal, false);
    todos.push(objekTugas);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

const angkaTugas = document.getElementById('tugasCount');

document.addEventListener(RENDER_EVENT, function () {
    const listTugas = document.getElementById('todos');
    listTugas.innerHTML = '';

    const listTugasSelesai = document.getElementById('todos-selesai');
    listTugasSelesai.innerHTML = '';

    let jumlahTugas = 0;
    for (const itemTugas of todos) {
        const todoElement = makeTodo(itemTugas);
        if (!itemTugas.isCompleted) {
            // tugas belum selesai
            listTugas.append(todoElement);
            jumlahTugas++;
        } else {
            listTugasSelesai.append(todoElement);
        }
    }

    angkaTugas.innerText = jumlahTugas;
});

function makeTodo(objekTugas) {
    // buat munculin tugas ke UI
    const tugasTitle = document.createElement('h2');
    const tugasWaktu = document.createElement('p');

    tugasTitle.innerText = objekTugas.task;
    tugasWaktu.innerText = objekTugas.timestamp;

    const tugasContainer = document.createElement('div');
    tugasContainer.classList.add('inner');
    tugasContainer.append(tugasTitle, tugasWaktu);


    const finalContainer = document.createElement('div');
    finalContainer.classList.add('item', 'shadow');
    finalContainer.append(tugasContainer);
    finalContainer.setAttribute('id', `todo-${objekTugas.id}`);

    // buat check, uncheck, remove button
    if (objekTugas.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            batalSelesai(objekTugas.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function () {
            hapusTugas(objekTugas.id);
        });

        finalContainer.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            tugasSelesai(objekTugas.id);
        });
        finalContainer.append(checkButton);
    }

    return finalContainer;
}

function findTodo(tugasId) {
    for (const todoItem of todos) {
        if (todoItem.id === tugasId) {
            return todoItem;
        }
    }
}

function tugasSelesai(tugasId) {
    const todoTarget = findTodo(tugasId);
    if (todoTarget == null) return;
    todoTarget.isCompleted = true;
    console.log(todoTarget);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function batalSelesai(tugasId) {
    const todoTarget = findTodo(tugasId);
    if (todoTarget == null) return;
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function hapusTugas(tugasId) {
    const todoTarget = findTodoIndex(tugasId);
    if (todoTarget === -1) return;
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoIndex(tugasId) {
    for (const index in todos) {
        if (todos[index].id === tugasId) {
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsedData = JSON.stringify(todos);
        localStorage.setItem(DATA_KEY, parsedData);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(DATA_KEY));
});

function loadDataFromStorage() {
    const localData = localStorage.getItem(DATA_KEY);
    let parsedData = JSON.parse(localData);

    if (parsedData !== null) {
        for (const todo of parsedData) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}