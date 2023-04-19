import { app } from "./firebaseConf";
import { addDoc, collection, deleteDoc, doc, getDocs, initializeFirestore, onSnapshot, orderBy, persistentLocalCache, persistentMultipleTabManager, query, updateDoc } from 'firebase/firestore';
import type { Todo, TodoRequest } from "./todoStore";
import { writable } from "svelte/store";

const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

function createFirebaseStore() {
    const { subscribe, set, update } = writable<Todo[]>([]);

    const todosQuery = query(collection(db, 'todos'), orderBy("date"));
    const unsubscribe = onSnapshot(todosQuery, (querySnapshot) => {
        const newData = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Todo));
        set(newData);
    });

    const getTodos = async () => {
        const res = await getDocs(todosQuery);
        set(res.docs.map((d) => ({ id: d.id, ...d.data() } as Todo)));
    }

    const addTodo = async (text: string) => {
        const todoRequest: TodoRequest & { date: Date } = {
            text,
            state: 'ongoing',
            date: new Date(),
        };
        try {
            await addDoc(collection(db, 'todos'), todoRequest);
        } catch (e) {
            console.error(`Error adding ${todoRequest}`, e);
        }
    }

    const updateTodo = async (t: Todo) => {
        const { id, ...tr } = t;
        try {
            await updateDoc(doc(db, 'todos', id), tr);
        } catch (e) {
            console.error(`error updating ${t}`);
        }
    }
    const deleteTodo = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'todos', id));
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