<script lang="ts">
  let { left = 400, top = 100, grid = 10 } = $props();

  export function drag(node: HTMLElement) {
    let moving = false;

    node.style.position = "absolute";
    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    node.style.cursor = "move";
    node.style.userSelect = "none";

    node.addEventListener("mousedown", (e: MouseEvent) => {
      if (e.button == 0) moving = true;
    });

    window.addEventListener("mousemove", (e: MouseEvent) => {
      if (moving) {
        left += e.movementX;
        top += e.movementY;

        if (e.shiftKey) {
          console.log("Remember to implement grid snapping.");
        }

        node.style.top = `${top}px`;
        node.style.left = `${left}px`;
      }
    });

    window.addEventListener("mouseup", (e: MouseEvent) => {
      if (e.button == 0) moving = false;
    });
  }
</script>

<div class="node" role="group" aria-label="Component" use:drag>
  <div class="node__body">
    <!-- Left ports -->
    <div class="ports ports--left">
      <div class="port"><span class="port__label">A</span></div>
      <div class="port"><span class="port__label">B</span></div>
    </div>

    <!-- Center content -->
    <div class="center">
      <span>OR</span>
    </div>

    <!-- Right ports -->
    <div class="ports ports--right">
      <div class="port"><span class="port__label">O</span></div>
    </div>
  </div>
  <div class="node__footer">
    <button class="btn" type="button">Edit</button>
    <button class="btn">X</button>
  </div>
</div>

<style>
  :root {
    --bg: grey;
    --panel: grey;
    --border: #2a3242;
    --text: #dfe7f1;
    --muted: #9fb0c6;
    --accent: #4da3ff;
    --btn-bg: #1f2633;
    --btn-border: #344055;
    --btn-hover: #273044;

    --jack: 8px;
    --jack-stroke: 5px;
    --pad: 9px;
    --edge-gutter: calc(var(--jack) / 2 + var(--jack-stroke));

    --radius: 12px;
  }

  .node {
    border-radius: var(--radius);
    display: inline-block;
    min-width: 100px;
  }

  .node:hover {
    z-index: 1;
  }

  .node__footer {
    display: none;
    transform: translateY(-100%);
    pointer-events: none;
    padding: 4px 8px;
    background: var(--accent);
    border-bottom: 1px solid var(--border);
    font-weight: 600;
    letter-spacing: 0.2px;
    color: var(--text);
    white-space: nowrap;
    border-radius: var(--radius);
  }

  .node:hover .node__footer,
  .node__footer:hover {
    display: grid;
    transform: translateY(0%);
    pointer-events: auto;
  }

  .node__body {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    display: grid;
    grid-template-columns: auto auto auto;
    padding-top: var(--pad);
    padding-bottom: var(--pad);
  }

  .ports {
    display: grid;
    gap: 10px;
    align-content: center;
  }

  .port {
    position: relative;
  }

  .port__label {
    color: var(--muted);
    font-weight: 600;
    letter-spacing: 0.3px;
    padding: var(--edge-gutter);
  }

  .ports--left .port::after,
  .ports--right .port::before {
    content: "";
    position: absolute;
    top: 50%;
    width: var(--jack);
    height: var(--jack);
    background: var(--accent);
    border: var(--jack-stroke) solid var(--border);
    border-radius: 50%;
    transform: translateY(-50%);
  }
  .ports--left .port::after {
    left: calc(-1 * var(--edge-gutter));
  }
  .ports--right .port::before {
    right: calc(-1 * var(--edge-gutter));
  }

  /* Center content (button) */
  .center {
    display: grid;
    place-items: center;
  }

  .btn {
    padding: 4px 10px;
    border-radius: 8px;
    background: var(--btn-bg);
    border: 1px solid var(--btn-border);
    color: var(--text);
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    user-select: none;
  }
  .btn:hover {
    background: var(--btn-hover);
    border-color: var(--accent);
  }
  .btn:active {
    transform: translateY(1px);
  }

  /* Connection dots */
</style>
