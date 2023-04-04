import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';

export interface Todo {
    id: string;
    state: 'done' | 'ongoing';
    text: string;
}

function createTodoStore() {
    const { subscribe, set, update } = writable<Todo[]>([
        { id: '1', text: 'git add .', state: 'done' },
        { id: '2', text: 'git commit', state: 'done' },
        { id: '3', text: 'git push', state: 'ongoing' },
        { id: '4', text: 'escape building', state: 'ongoing' },
    ]);

    const addTodo = (text: string) => {
        const todo: Todo = {
            text,
            id: uuid(),
            state: 'ongoing',
        };
        update(ts => [...ts, todo]);
    }
    const updateTodo = (t: Todo) => update(ts => ts.map(v => v.id === t.id ? t : v));
    const deleteTodo = (id: string) => update(ts => ts.filter(t => id !== t.id));
    
    return {
        subscribe,
        set,
        update,
        addTodo,
        updateTodo,
        deleteTodo,
    }
}

export const todos = createTodoStore();