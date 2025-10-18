<script lang="ts">
  import { onMount } from "svelte";

  let width = 1000,
    height = 1000;

  type Line = { x1: number; y1: number; x2: number; y2: number };
  type Point = { x: number; y: number };

  let canvas: SVGSVGElement | undefined = $state();

  let lines = new Array<Line>();

  let view_x = $state(0);
  let view_y = $state(0);

  let cur_line: SVGLineElement | null = null;
  let is_darwing = $state(false);
  let is_dragging = $state(false);
  let start: Point | undefined = $state();
  let mouse_pos: Point | undefined = $state();

  onMount(() => {
    draw();
  });

  function makeLine(line: Line): SVGLineElement {
    let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttributeNS(null, "x1", `${line.x1}`);
    l.setAttributeNS(null, "x2", `${line.x2}`);
    l.setAttributeNS(null, "y1", `${line.y1}`);
    l.setAttributeNS(null, "y2", `${line.y2}`);
    l.setAttributeNS(null, "stroke", "oklch(0.9 0.3 164)");
    l.setAttributeNS(null, "stroke-width", "5");
    return l;
  }

  export function draw() {
    if (!canvas) return;

    for (const line of lines) {
      canvas.append(makeLine(line));
    }
  }

  function handleStart(evt: MouseEvent) {
    if (!canvas) return;

    if (is_darwing && cur_line) {
      cur_line.remove();
      is_darwing = false;
      cur_line = null;
    }

    if (evt.button === 0) {
      start = { x: evt.offsetX, y: evt.offsetY };
      cur_line = makeLine({
        x1: start.x + view_x,
        x2: start.x + view_x,
        y1: start.y + view_y,
        y2: start.y + view_y,
      });
      canvas.append(cur_line);
      is_darwing = true;
    } else if (evt.button === 1) {
      start = { x: evt.offsetX, y: evt.offsetY };
      is_dragging = true;
    }
  }

  function handleMove(evt: MouseEvent) {
    mouse_pos = { x: evt.offsetX, y: evt.offsetY };
    if (!canvas) return;

    if (is_darwing) {
      cur_line?.setAttribute("x2", `${evt.offsetX + view_x}`);
      cur_line?.setAttribute("y2", `${evt.offsetY + view_y}`);
    } else if (is_dragging) {
      view_x += start!.x - mouse_pos.x;
      view_y += start!.y - mouse_pos.y;
      start = { x: evt.offsetX, y: evt.offsetY };
    }
  }

  function handleEnd(evt: MouseEvent) {
    if (!canvas) return;

    if (evt.button === 0) {
      is_darwing = false;
      lines.push({
        x1: start!.x + view_x,
        y1: start!.y + view_y,
        x2: evt.offsetX + view_x,
        y2: evt.offsetY + view_y,
      });
    } else if (evt.button === 1) {
      is_dragging = false;
    }
  }
</script>

<div>
  X: {mouse_pos?.x}; Y: {mouse_pos?.y}; dragging: {is_dragging}; drawing: {is_darwing};
  SX: {start?.x}; SY: {start?.y}
</div>
<main>
  <svg
    {width}
    {height}
    viewBox="{view_x} {view_y} {width} {height}"
    id="line-renderer"
    class="playground"
    bind:this={canvas}
    onmousedown={handleStart}
    onmousemove={handleMove}
    onmouseup={handleEnd}
    oncontextmenu={(e) => {
      e.preventDefault();
    }}
    role="none"
  >
  </svg>
</main>

<style>
  .playground {
    border: 1px solid black;
  }
</style>
