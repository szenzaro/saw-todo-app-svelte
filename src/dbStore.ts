import { app } from "./firebaseConf";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import type { Todo, TodoRequest } from "./todoStore";
import { writable } from "svelte/store";

const db = getFirestore(app);

function createFirebaseStore() {
    const { subscribe, set, update } = writable<Todo[]>([]);

    const getTodos = async () => {
        const res = await getDocs(collection(db, 'todos'));
        set(res.docs.map((d) => ({ id: d.id, ...d.data() } as Todo)));
    }

    const addTodo = async (text: string) => {
        const todoRequest: TodoRequest & { date: Date } = {
            text,
            state: 'ongoing',
            date: new Date(),
        };

        try {
            const todoRef = await addDoc(collection(db, 'todos'), todoRequest);
            update(ts => [...ts, { id: todoRef.id, ...todoRequest }]);
        } catch (e) {
            console.error(`Error adding ${todoRequest}`, e);
        }
    }

    const updateTodo = async (t: Todo) => {
        const { id, ...tr } = t;
        try {
            await updateDoc(doc(db, 'todos', id), tr);
            update(ts => ts.map(v => v.id === t.id ? t : v));
        } catch (e) {
            console.error(`error updating ${t}`);
        }
    }
    const deleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
            update(ts => ts.filter(t => id !== t.id));
        } catch (e) {
            console.error(`error deleting ${id}`);
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

export const todos = createFirebaseStore();