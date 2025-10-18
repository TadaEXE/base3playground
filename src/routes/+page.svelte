<script lang="ts">
  import { onMount } from "svelte";

  let width = 300,
    height = 300;

  type Line = { x1: number; y1: number; x2: number; y2: number };
  type Point = { x: number; y: number };

  let canvas: HTMLCanvasElement | undefined = $state();
  let context: CanvasRenderingContext2D | undefined = $state();

  let lines = new Array<Line>({ x1: 0, y1: 0, x2: 100, y2: 100 });

  let top = $state();
  let left = $state();

  let cur_line: Line | null = null;
  let is_darwing = $state(false);
  let start: Point;
  let mouse_pos: Point | undefined = $state();

  onMount(() => {
    context = canvas!.getContext("2d")!;
    handleSize();
    draw();
  });

  export function draw() {
    if (!context) return;

    context.clearRect(0, 0, canvas!.width, canvas!.height);
    context.save();
    context.strokeStyle = "black";
    context.lineWidth = 3;

    for (const line of lines) {
      context.beginPath();
      context.moveTo(line.x1, line.y1);
      context.lineTo(line.x2, line.y2);
      context.closePath();
      context.stroke();
    }

    context.stroke();
    context.restore();
  }

  function handleStart(evt: MouseEvent) {
    start = { x: evt.offsetX, y: evt.offsetY };
    is_darwing = true;
  }

  function handleMove(evt: MouseEvent) {
    mouse_pos = { x: evt.offsetX, y: evt.offsetY };
    if (!is_darwing || !context) return;

    draw();
    context.moveTo(start.x, start.y);
    context.lineTo(evt.offsetX, evt.offsetY);
    context.stroke();
  }

  function handleEnd(evt: MouseEvent) {
    if (!is_darwing || !context) return;

    is_darwing = false;
    lines.push({ x1: start.x, y1: start.y, x2: evt.offsetX, y2: evt.offsetY });
    draw();
  }

  function handleSize() {
    if (!canvas) return;

    const { top: t, left: l } = canvas.getBoundingClientRect();
    top = t;
    left = l;
  }
</script>

<svelte:window onresize={handleSize} />
<div>
  X: {mouse_pos?.x}; Y: {mouse_pos?.y} ({is_darwing})
</div>
<main>
  <canvas
    {width}
    {height}
    id="line-renderer"
    class="playground"
    bind:this={canvas}
    onmousedown={handleStart}
    onmousemove={handleMove}
    onmouseup={handleEnd}
  >
  </canvas>
</main>

<style>
  .playground {
    border: 1px solid black;
  }
</style>
