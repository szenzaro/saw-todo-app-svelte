import { writable } from 'svelte/store';

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
    ])

    return {
        subscribe,
    }
}