<script lang="ts">
  import { connect, isConnected as isConnectedStore} from '../connection';
  import { sortTabs } from '../utils';

  import ConnectionStatus from '../components/connection-status.svelte';
  import FilePicker from '../components/file-picker.svelte';

  let isConnected = false;
  isConnectedStore.subscribe(value => isConnected = value);
</script>

<main>
  <h1>probable-invention</h1>

  <ConnectionStatus />

  <div>
    <button
      on:click={connect}
      disabled={isConnected}
    >
      Establish connection
    </button>
  </div>

  <FilePicker />

  <div>
    <button
      on:click={sortTabs}
    >
      Sort local tabs
    </button>
  </div>

  <footer>
    Author: <a href="https://mateossh.me" target="_blank" rel="noreferrer">mateossh</a>
  </footer>
</main>

<style>
  footer {
    color: #888;
  }
</style>
