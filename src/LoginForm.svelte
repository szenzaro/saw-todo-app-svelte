<script lang="ts">
    import { userStore } from './loginStore';
    
    let email = "";
    let pwd = "";

</script>

<form on:submit|preventDefault>
    <label for="username">Username:</label>
    <input id="username" bind:value={email} type="text" />
    <br />
    <label for="pwd">Password:</label>
    <input id="pwd" bind:value={pwd} type="password" />
    <br />
    <button on:click={() => userStore.login(email, pwd)}> Login </button>
    <button on:click={userStore.googleLogin}>Google</button>
</form>
