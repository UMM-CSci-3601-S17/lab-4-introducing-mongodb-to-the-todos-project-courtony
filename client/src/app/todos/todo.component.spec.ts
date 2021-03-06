
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { Todo } from "./todo";
import { TodoListComponent } from "./todo-list.component";
import { TodoListService } from "./todo-list.service";
import { Observable } from "rxjs";
import { PipeModule } from "../../pipe.module";

describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: (owner: string, category: string, status: boolean) => Observable<Todo[]>
    };

    beforeEach(() => {
        // mock todolist
        todoListServiceStub = {
            getTodos: (owner: string, category: string, status: boolean) => Observable.of([
                {
                    id: "58895985a22c04e761776d54",
                    owner: "Blanche",
                    status: false,
                    body: "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
                    category: "software design"
                },
                {
                    id: "58895985c1849992336c219b",
                    owner: "Fry",
                    status: false,
                    body: "Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.",
                    category: "video games"
                },
                {
                    id: "58895985ae3b752b124e7663",
                    owner: "Fry",
                    status: true,
                    body: "Ullamco irure laborum magna dolor non. Anim occaecat adipisicing cillum eu magna in.",
                    category: "homework"
                },
                {
                    id: "58895985186754887e0381f5",
                    owner: "Blanche",
                    status: true,
                    body: "Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.",
                    category: "software design"
                },
                {
                    id: "5889598555fbbad472586a56",
                    owner: "Blanche",
                    status: true,
                    body: "Aliqua esse aliqua veniam id nisi ea. Ullamco Lorem ex aliqua aliquip cupidatat incididunt reprehenderit voluptate ad nisi elit dolore laboris.",
                    category: "groceries"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [PipeModule],
            declarations: [ TodoListComponent ],
            providers:    [ { provide: TodoListService, useValue: todoListServiceStub } ]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the todos", () => {
        todoList.initialize();
        expect(todoList.todos.length).toBe(5);
    });

    it("contains a todo with an owner named 'Fry'", () => {
        todoList.setOwner("Fry");
        todoList.initialize();
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Fry" )).toBe(true);
    });

    it("doesn't contain a todo with an owner named 'Maria'", () => {
        todoList.setOwner("Maria");
        todoList.initialize();
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Maria" )).toBe(false);
    });

    it("has two todos that are in the category 'software design'", () => {
        todoList.setCategory("software design");
        todoList.initialize();
        expect(todoList.todos.filter((todo: Todo) => todo.category === "software design").length).toBe(2);
    });

    it("does somethig hopefully", () => {
        expect(API_URL).toBe("http://localhost:4567/api/");
    })
});
