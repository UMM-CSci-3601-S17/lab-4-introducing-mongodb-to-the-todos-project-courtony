import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Todo } from './todo';
import { Observable } from "rxjs";
import {isUndefined} from "util";

@Injectable()
export class TodoListService {
    private todoUrl: string = API_URL + "todos";
    constructor(private http:Http) { }
    private first: boolean;

    buildQuery(owner: string, category: string, status: any): void {
        this.todoUrl = API_URL +"todos";
        this.first = true;

        if (owner) {
            this.todoUrl = this.todoUrl + "?owner=" + owner;
            this.first = false;
        }

        if (category) {
            if (this.first) {
                this.todoUrl = this.todoUrl + "?category=" + category;
                this.first = false;
            } else {
                this.todoUrl = this.todoUrl + "&category=" + category;
            }
        }

        if (!isUndefined(status) && status !== "") {
            if (this.first) {
                this.todoUrl = this.todoUrl + "?status=" + status;
            } else {
                this.todoUrl = this.todoUrl + "&status=" + status;
            }
        }
    }

    getTodos(owner: string, category: string, status: boolean): Observable<Todo[]> {
        this.buildQuery(owner, category, status);
        return this.http.request(this.todoUrl).map(res => res.json());
    }

    getTodoById(id: string): Observable<Todo> {
        return this.http.request(this.todoUrl + "/" + id).map(res => res.json());
    }
}