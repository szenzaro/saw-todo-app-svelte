<script lang="ts">
    import TodoItem from "./lib/TodoItem.svelte";

  let hello = "hello";
</script>

<h1>TODO Web App</h1>

<section>
  <input type="text" placeholder="Insert text..." />

  <span class="counter">1/3</span>
  <ul>
    <li>
      <TodoItem/>
    </li>
  </ul>
</section>
