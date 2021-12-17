// Tasks Container
const tasksContainer = document.getElementById('tasksContainer');

let taskNum = 1 ;

const add = event => {
    event.preventDefault();
    const { value } = event.target.taskText;
    if (!value) {
        return;
    }
    else {
        taskObject = {
            id: taskNum,
            task: value
        }
        const taskHtml = document.createElement('div');
        taskHtml.classList.add('task', 'roundBorder');
        taskHtml.textContent = '('+taskNum+')'+' '+value;
        taskHtml.setAttribute('id', taskNum);
        taskHtml.addEventListener('click', changeTaskState);
        tasksContainer.prepend(taskHtml);
        taskHtml.innerHTML+='  <button type="button" class="editButton roundBorder" onclick="editButton('+taskObject.id+')">Edit</button>';
        event.target.reset();
        //add the task in the database
        requestPost(taskObject);

        taskNum++;
    }
};

const changeTaskState = event => {
    event.target.classList.toggle('done');
};

async function editButton (idTask) {
    let newTask = prompt("Please, write the new task.");
    if (newTask!=null) {
        /*This does the modification in the front-end part*/
        taskObject = {
            id: idTask,
            task: newTask
        }
        let div = document.getElementById(taskObject.id);
        div.innerHTML = '('+taskObject.id+')'+' '+taskObject.task;
        div.textContent = '('+taskObject.id+')'+' '+taskObject.task;
        div.innerHTML+='  <button type="button" class="editButton roundBorder" onclick="editButton('+taskObject.id+')">Edit</button>';
        /*This does the modification in the database doing a request*/
        requestPatch(taskObject);
    }
}

async function deleteTasks () {
    const done = [];
    const toDo = [];
    let tasksToDelete = [];
    let v = tasksContainer.childNodes;
    for (let i=0; i<v.length; i++) {
        if (v[i].classList!=null) {
            if (v[i].classList.contains('done')) {
                tasksToDelete.push(v[i].textContent); /*pushing the text of the task to delete*/
                done.push(v[i]);
            }
            else {
                toDo.push(v[i]);
            }
        }
    }
    /*Now I'll iterate all the tasks to delete in the database*/
    for (let i=0; i<tasksToDelete.length; i++) {
        let id = getId(tasksToDelete[i]);
        requestDelete(id);
    }
}

function getId (v) {
    let pri = false;
    let closed = false;
    let i = 0;
    let id = [''];
    while (!closed && i<v.length) {
        if (v[i]=='(') {
            pri = true;
        }
        else {
            if (pri && v[i]!=')') {
                id+=v[i];
            }
            else {
                if (pri && v[i]==')') {
                    closed=true;
                }
            }
        }
        i++;
    }
    return id;
}

const renderOrderedTasks = () => {
    order().forEach(el => tasksContainer.appendChild(el))
}

//Requests

async function requestPost(taskObject) {
    const request = await fetch('api/tasks', {
       method: 'POST',
       headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
       },
       body: JSON.stringify(taskObject)
    });
    const tasks = await request.json();
}

async function requestPatch(taskObject) {
    const request = await fetch('api/tasks/'+taskObject.task, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskObject)
    });
}

async function requestDelete(id) {
    /*This will delete the actual task (while it's iterating) from the database*/
    let div = document.getElementById(id);
    if (div!=null) {
        div.parentElement.removeChild(div);
        const request = await fetch('api/tasks/'+id, {
           method: 'DELETE',
           headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           }
        });
    }
}