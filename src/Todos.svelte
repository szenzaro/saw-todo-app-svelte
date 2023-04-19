<script lang="ts">
    import TodoItem from "./lib/TodoItem.svelte";
    import { userStore } from "./loginStore";
    import { todos } from "./todoStore";
    todos.getTodos();
    let text = "";
    const onKeyup = (e: KeyboardEvent) => {
        if (e.key === "Enter" && text.trim() !== "") {
            todos.addTodo(text);
        }
    };
</script>

<div class="user-info">
    <p>Welcome {$userStore.email}</p>
    <button on:click={userStore.logout}>logout</button>
</div>

<section>
    <input
        on:keyup={onKeyup}
        type="text"
        bind:value={text}
        placeholder="Insert text..."
    />

    <span class="counter">
        {$todos.filter(({ state }) => state === "done").length}/{$todos.length}
    </span>
    <ul>
        {#each $todos as todo}
            <li>
                <TodoItem {todo} />
            </li>
        {/each}
    </ul>
</section>
