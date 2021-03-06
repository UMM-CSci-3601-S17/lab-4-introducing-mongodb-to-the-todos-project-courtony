import { Component, OnInit } from '@angular/core';
import { TodoListService } from "./todo-list.service";
import { Todo } from "./todo";
import { FilterBy } from "../users/filter.pipe";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    providers: [ FilterBy ]
})

export class TodoListComponent {
    public todos: Todo[];
    public Msg: string = "Enter";
    public searchOwner: string;
    public searchCategory: string;
    public targetStatus: boolean;

    constructor(private todoListService: TodoListService) {

    }


    onClickMe() {
        this.Msg = 'Searching';
        this.todoListService.getTodos(this.searchOwner, this.searchCategory, this.targetStatus).subscribe(
            todos => this.todos = todos,
            err => {
                console.log(err);
            }
        );

        this.Msg = 'Enter';
    }

    setOwner(owner: string) {
        this.searchOwner = owner;
    }

    setCategory(cat: string) {
        this.searchCategory = cat;
    }

    setStatus(status: boolean) {
        this.targetStatus = status;
    }

    initialize() {
        this.onClickMe();
    }
}