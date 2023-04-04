import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

export interface Todo {
    id: string;
    state: 'done' | 'ongoing';
    text: string;
}

const apiPath = 'http://localhost:1234/api/v1'

interface TodoRequest {
    text: string;
    state: 'done' | 'ongoing';
}

interface TodosResponse {
    links: {
        self: string,
    },
    metadata: {
        timestamp: string,
        count: number,
    },
    data: Todo[];
}

function createTodoStore() {
    const { subscribe, set, update } = writable<Todo[]>([]);

    const getTodos = async () => {
        const res = await fetch(`${apiPath}/todos`);
        const todoRes: TodosResponse = await res.json();

        set(todoRes.data);
    }

    const addTodo = async (text: string) => {
        const todoRequest: TodoRequest = {
            text,
            state: 'ongoing',
        };
        const res = await fetch(`${apiPath}/todos`, {
            method: 'POST',
            body: JSON.stringify(todoRequest),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            const todo = await res.json();
            update(ts => [...ts, todo]);
        }
    }
    const updateTodo = async (t: Todo) => {
        const { id, ...tr } = t;
        const res = await fetch(`${apiPath}/todos/${t.id}`, {
            method: 'PUT',
            body: JSON.stringify(tr),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (res.ok) {
            const resData = await res.json();
            update(ts => ts.map(v => v.id === t.id ? resData.data : v));
        }
    }
    const deleteTodo = async (id: string) => {
        const res = await fetch(`${apiPath}/todos/${id}`, {
            method: 'DELETE',
        })
        if (res.ok) {
            update(ts => ts.filter(t => id !== t.id));
        }
    }

    return {
        subscribe,
        set,
        update,
        addTodo,
        updateTodo,
        deleteTodo,
        getTodos,
    }
}

export const todos = createTodoStore();