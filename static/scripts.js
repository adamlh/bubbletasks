document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskContainer = document.getElementById('task-container');
    const taskList = document.getElementById('task-list');
    let bubbles = [];
    const speedFactor = 0.5; // Fixed speed factor for bubbles

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    function addTask(content) {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `content=${encodeURIComponent(content)}`
        })
        .then(response => response.json())
        .then(data => {
            console.log('Tasks:', data.tasks);
            updateTasks(data.tasks);
        });
    }

    function fetchTasks() {
        fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            console.log('Tasks on load:', data.tasks);
            updateTasks(data.tasks);
        });
    }

    function updateTasks(tasks) {
        taskContainer.innerHTML = '';
        bubbles = [];
        const now = new Date();

        tasks.forEach(task => {
            const taskBubble = document.createElement('div');
            taskBubble.classList.add('task-bubble');
            taskBubble.innerText = task.content;

            const timestamp = new Date(task.timestamp);
            const timeDiff = Math.floor((now - timestamp) / 1000);
            const size = Math.min(200, 50 + timeDiff);

            taskBubble.style.width = `${size}px`;
            taskBubble.style.height = `${size}px`;
            taskBubble.style.backgroundColor = getRandomColor();

            const bubble = {
                element: taskBubble,
                size: size,
                x: Math.random() * (taskContainer.clientWidth - size),
                y: Math.random() * (taskContainer.clientHeight - size),
                dx: (Math.random() - 0.5) * speedFactor,
                dy: (Math.random() - 0.5) * speedFactor
            };

            taskBubble.style.left = `${bubble.x}px`;
            taskBubble.style.top = `${bubble.y}px`;

            bubbles.push(bubble);
            taskContainer.appendChild(taskBubble);


            const taskItem = document.createElement('li');
            taskItem.innerText = task.content;
            taskList.appendChild(taskItem);
        });

        animateBubbles();
    }

    function animateBubbles() {
        bubbles.forEach(bubble => {
            bubble.x += bubble.dx;
            bubble.y += bubble.dy;

            if (bubble.x <= 0 || bubble.x + bubble.size >= taskContainer.clientWidth) {
                bubble.dx *= -1;
            }

            if (bubble.y <= 0 || bubble.y + bubble.size >= taskContainer.clientHeight) {
                bubble.dy *= -1;
            }

            bubbles.forEach(otherBubble => {
                if (bubble !== otherBubble && isColliding(bubble, otherBubble)) {
                    bubble.dx *= -1;
                    bubble.dy *= -1;
                    otherBubble.dx *= -1;
                    otherBubble.dy *= -1;
                }
            });

            bubble.element.style.left = `${bubble.x}px`;
            bubble.element.style.top = `${bubble.y}px`;
        });

        requestAnimationFrame(animateBubbles);
    }

    function isColliding(bubble1, bubble2) {
        const distX = bubble1.x + bubble1.size / 2 - (bubble2.x + bubble2.size / 2);
        const distY = bubble1.y + bubble1.size / 2 - (bubble2.y + bubble2.size / 2);
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance < (bubble1.size + bubble2.size) / 2;
    }


    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    fetchTasks();
});
