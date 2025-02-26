const tasksContainer = document.getElementById('tasks');

const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileForm = document.getElementById('profileForm');

const editTaskModal = document.getElementById('editTaskModal');
const editTaskForm = document.getElementById('editTaskForm');

const closeBtns = document.querySelectorAll('.close');

let currentTaskId = null;
const token = localStorage.getItem('token');

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data.data[0]);
        if (data.success) {
            tasksContainer.innerHTML = data.data.map(task => `
                <div class="task">
                    <div>
                        <h3>${task.title}</h3>
                        <p>${task.description}</p>
                        <small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <button onclick="editTask('${task._id}')">Edit</button>
                        <button onclick="deleteTask('${task._id}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        alert('Error loading tasks');
    }
};


async function deleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const status = await response.json();
        if (status.success)
        {
            await loadTasks();
        }
    } catch (error) {
        alert('Error deleting task');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    if (!token) {
        window.location.href = '/';
        return;
    }

    const taskForm = document.getElementById('taskForm');
    const logoutBtn = document.getElementById('logoutBtn');

    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskForm.querySelector('input[type="text"]').value;
        const description = taskForm.querySelector('textarea').value;
        const dueDate = taskForm.querySelector('input[type="date"]').value;
        console.log(title, description, dueDate);
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, dueDate })
            });
            console.log(response);
            const data = await response.json();
            if (data.success) {
                taskForm.reset();
                await loadTasks();
            }
        } catch (error) {
            alert('Error adding task');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });

    // Initial load
    await loadTasks();
});


const loadProfile = async () => {
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('username').value = data.data.username;
            document.getElementById('email').value = data.data.email;
        }
    } catch (error) {
        alert('Error loading profile');
    }
};

profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/users/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username, email })
        });

        const data = await response.json();
        if (data.success) {
            alert('Profile updated successfully');
            profileModal.classList.remove('show');
        }
    } catch (error) {
        alert('Error updating profile');
    }
});

window.editTask = async (taskId) => {
    currentTaskId = taskId;
    
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            const task = data.data;
            document.getElementById('editTitle').value = task.title;
            document.getElementById('editDescription').value = task.description;
            document.getElementById('editDueDate').value = task.dueDate.split('T')[0];
            editTaskModal.classList.add('show');
        }
    } catch (error) {
        alert('Error loading task details');
    }
};

editTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentTaskId) {
        alert('No task selected for editing');
        return;
    }
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const dueDate = document.getElementById('editDueDate').value;

    try {
        const response = await fetch(`/api/tasks/${currentTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, dueDate })
        });

        const data = await response.json();
        if (data.success) {
            editTaskModal.classList.remove('show');
            currentTaskId = null;
            await loadTasks();
        }
    } catch (error) {
        alert('Error updating task');
    }
});

// Update task
editTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const dueDate = document.getElementById('editDueDate').value;

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, dueDate })
        });

        const data = await response.json();
        if (data.success) {
            editTaskModal.classList.remove('show');
            await loadTasks();
        }
    } catch (error) {
        alert('Error updating task');
    }
});

// Modal controls
profileBtn.addEventListener('click', () => {
    profileModal.classList.add('show');
    loadProfile();
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        profileModal.classList.remove('show');
        editTaskModal.classList.remove('show');
        currentTaskId = null;
    });
});
