<script lang="ts">
  import { isConnected } from '../connection';

  let status = false;

  isConnected.subscribe(value => status = value);
</script>

<div class="wrapper">
  <div>Connection status</div>
  <div
    class="status"
    class:on={status}
    class:off={!status}
  />
</div>

<style>
  .wrapper {
    width: 192px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    margin: 12px auto;
  }

  .status {
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
  }

  .on {
    background: lightgreen;
  }

  .off{
    background: darkgreen;
  }
</style>
