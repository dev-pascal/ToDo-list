package crudjava.todolist.rest;

import crudjava.todolist.model.Task;
import crudjava.todolist.repository.TaskRepository;
import crudjava.todolist.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URISyntaxException;
import java.util.*;
import java.net.URI;

@RestController
@RequestMapping("api/tasks")
public class TaskRest {
    @Autowired
    private TaskService taskService;

    @GetMapping
    private ResponseEntity<List<Task>> getAllTasks(){
        return ResponseEntity.ok(taskService.findAll());
    }

    @PostMapping
    private ResponseEntity<Task> saveTask (@RequestBody Task task) {
        try {
            Task savedTask = taskService.save(task);
            return ResponseEntity.created(new URI("api/tasks/"+savedTask.getId())).body(savedTask);
        }
        catch (URISyntaxException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<Boolean> deleteTask (@PathVariable("id") Long id){
        taskService.deleteById(id);
        return ResponseEntity.ok(!(taskService.findById(id)!=null));
    }

    @PatchMapping("/{task}")
    private ResponseEntity<Task> updateTask(@PathVariable("task") String taskStr, @RequestBody Task task) {
        try {
            Task taskObject = taskService.findById(task.getId()).get();
            taskObject.setTask(taskStr);
            return new ResponseEntity<Task>(taskService.save(taskObject), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Task>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
