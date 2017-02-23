import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Todo } from './todo';
import { Observable } from "rxjs";
import {isUndefined} from "util";

@Injectable()
export class TodoListService {
    private todoUrl: string = API_URL + "todos";
    constructor(private http:Http) { }
    private state; string;
    private first: boolean;

    buildQuery(owner: string, category: string, status: boolean): void {
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

        if (!isUndefined(status)) {
            // if(status = 1){
            //     this.state = "true";
            // }else {
            //     this.state = "false";
            // }
            if (this.first) {
                this.todoUrl = this.todoUrl + "?status=" + this.state;
            } else {
                this.todoUrl = this.todoUrl + "&status=" + this.state;
            }
        }
    }

    getTodos(owner: string, category: string, status: boolean): Observable<Todo[]> {
        // if(status){
        //     this.state= "complete";
        // }else if (!status) {
        //     this.state = "incomplete";
        // }
        // if(owner != null && owner != ""){
        //     this.todoUrl = this.todoUrl +"?owner="+owner;
        // }
        // if(category != null && category != ""){
        //     if(owner != null && owner != ""){
        //         this.todoUrl = this.todoUrl + "&category=" + category;
        //     }else{
        //         this.todoUrl = this.todoUrl + "?category=" + category;
        //     }
        // }
        // if(status != null){
        //     if((category != null && category != "") || (owner != null && owner != "")){
        //         this.todoUrl = this.todoUrl + "&status=" + this.state;
        //     }else{
        //             this.todoUrl = this.todoUrl + "?status=" + this.state;
        //         }
        //
        // }
        this.buildQuery(owner, category, status);
        console.log(this.todoUrl);
        return this.http.request(this.todoUrl).map(res => res.json());
    }

    getTodoById(id: string): Observable<Todo> {
        return this.http.request(this.todoUrl + "/" + id).map(res => res.json());
    }
}