<script lang="ts">
    import type { Todo } from "../todoStore";
    import { todos } from "../todoStore";

    export let todo: Todo;
    let editing = false;
    let input: HTMLInputElement;
    
    const onKeyup = (e: KeyboardEvent) => {
        const text = input.value;
        if (e.key === "Enter" && text.trim() !== "") {
            todos.updateTodo({ ...todo, text });
            editing = false;
        }

        if (e.key === "Escape") {
            editing = false;
        }
    };
</script>

<div class="todo-item">
    {#if editing}
        <input type="text" on:keyup={onKeyup} bind:this={input} />
    {:else}
        <div>
            <input
                checked={todo.state === "done"}
                on:change={() =>
                    todos.updateTodo({
                        ...todo,
                        state: todo.state === "done" ? "ongoing" : "done",
                    })}
                type="checkbox"
            />
            <span
                on:dblclick={() => {
                    editing = true;
                    text = todo.text;
                }}
                class:done={todo.state === "done"}
                >{todo.text}
            </span>
            <button on:click={() => todos.deleteTodo(todo.id)}>&times;</button>
        </div>
    {/if}
</div>
