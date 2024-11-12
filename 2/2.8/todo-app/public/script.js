document.addEventListener('DOMContentLoaded', fetchTodos);

async function fetchTodos() {
    try {
        const response = await fetch('http://localhost:3000/todos');
        if (!response.ok) throw new Error('Failed to fetch TODOs');
        
        const todos = await response.json();
        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = ''; // Clear any existing content

        todos.forEach(todo => {
            const li = document.createElement('li');
            li.textContent = todo;
            todoList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching TODOs:', error);
    }
}

document.getElementById('add-todo').addEventListener('click', async function() {
    const input = document.getElementById('todo-input');
    const todoText = input.value.trim();
    
    if (todoText && todoText.length <= 140) {
        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: todoText
            });

            if (!response.ok) throw new Error('Failed to add TODO');

            const li = document.createElement('li');
            li.textContent = todoText;
            document.getElementById('todo-list').appendChild(li);
            
            input.value = ''; // Clear input field after adding
        } catch (error) {
            console.error('Error adding TODO:', error);
        }
    } else {
        alert("TODO cannot be empty and must be less than 140 characters!");
    }
});
