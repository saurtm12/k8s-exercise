document.getElementById('add-todo').addEventListener('click', function() {
    const input = document.getElementById('todo-input');
    const todoText = input.value.trim();
    
    if (todoText && todoText.length <= 140) {
        const li = document.createElement('li');
        li.textContent = todoText;
        document.getElementById('todo-list').appendChild(li);
        
        input.value = ''; // Clear input field after adding
    } else {
        alert("TODO cannot be empty and must be less than 140 characters!");
    }
});
