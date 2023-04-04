<script lang="ts">
  import TodoItem from "./lib/TodoItem.svelte";
  import { todos } from "./todoStore";
  let text = "";
  const onKeyup = (e: KeyboardEvent) => {
    if (e.key === "Enter" && text.trim() !== "") {
      todos.addTodo(text);
    }
  };
</script>

<h1>TODO Web App</h1>

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
{JSON.stringify($todos)}
