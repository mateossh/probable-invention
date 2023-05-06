<script lang="ts">
  import { connection, isConnected as isConnectedStore} from '../connection';

  let path: string;

  let isConnected = false;
  isConnectedStore.subscribe(value => isConnected = value);

  function handleButton() {
    connection!.postMessage({
      query: 'openFiles',
      payload: path?.trim(),
    });
  }
</script>

<div class="wrapper">
  <input
    type="text"
    placeholder="Path"
    bind:value={path}
  />
  <button
    on:click={handleButton}
    disabled={!isConnected}
  >
    Open files
  </button>
</div>

<style>
  .wrapper {
    margin: 12px 0;
  }
</style>
