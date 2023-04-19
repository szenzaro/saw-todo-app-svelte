<script lang="ts">
  import LoginForm from "./LoginForm.svelte";
  import Todos from "./Todos.svelte";
  import { userStore } from "./loginStore";

</script>

<h1>TODO Web App</h1>

{#if $userStore}
  <Todos />
{:else}
  <LoginForm />
{/if}
