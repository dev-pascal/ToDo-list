package crudjava.todolist.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity

@Table(name = "tasks")

public class Task {
    @Id
    @Getter @Setter @Column(name = "id")
    private Long id;

    @Getter @Setter @Column(name = "task")
    private String task;

    public Task() {

    }

    public Task(String task) {
        this.task = task;
    }

    public Task(Long id, String task) {
        this.id = id;
        this.task = task;
    }

}
