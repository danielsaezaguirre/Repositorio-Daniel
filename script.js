// Selección de elementos DOM
const todoForm = document.getElementById('todo-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const taskCounter = document.getElementById('task-counter');
const filterBtns = document.querySelectorAll('.filter-btn');

// Estado de la aplicación
let tasks = JSON.parse(localStorage.getItem('web_tasks')) || [
    { id: 1, text: 'Revisar correos pendientes', priority: 'media', completed: false },
    { id: 2, text: 'Aprender interacción DOM con JS', priority: 'alta', completed: true }
];

let currentFilter = 'all';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});

// Event Listeners
todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text, prioritySelect.value);
        taskInput.value = '';
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Funciones principales
function addTask(text, priority) {
    const newTask = {
        id: Date.now(),
        text,
        priority,
        completed: false
    };
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('web_tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <div class="checkbox" onclick="toggleTask(${task.id})">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="task-text">${escapeHtml(task.text)}</span>
                    <span class="badge ${task.priority}">${task.priority}</span>
                </div>
                <button class="delete-btn" onclick="deleteTask(${task.id})" title="Eliminar tarea">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            taskList.appendChild(li);
        });
    }

    updateStats();
}

function updateStats() {
    const pendingCount = tasks.filter(t => !t.completed).length;
    taskCounter.textContent = `${pendingCount} ${pendingCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
