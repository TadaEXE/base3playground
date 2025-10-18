<script lang="ts">
  let {canvas = document.getElementById("lineCanvas") }= $props();

  export function dragstart(ev, group, item) {
    
  }
</script>

<div
  class="port"
  ondragstart={(e) => {
    console.log(e);
  }}
  role="none"
></div>

<style>
  .port {
    width: 12px;
    height: 12px;
    border: 4px solid lightblue;
    background: grey;
    border-radius: 50%;
  }
</style>
