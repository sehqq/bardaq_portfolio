import { useEffect, useRef, useState } from 'react';
import fragmentSource from './shaders/topo-field.frag?raw';

// Adapted from the supplied MengTo/threeui TopoField (MIT).
// Keep the original simplex-noise contours; render directly without its demo page/CDNs.
const vertexSource = `attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }`;

export default function TopoField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      shaders.forEach(shader => gl.deleteShader(shader));
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
    };
    if (!vertex || !fragment || !program || !buffer) { dispose(); return; }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const timeUniform = gl.getUniformLocation(program, 'u_time');
    const tokens = getComputedStyle(document.documentElement);
    const rgb = (name: string) => tokens.getPropertyValue(name).trim().split(/\s+/).map(value => Number(value) / 255);
    const base = rgb('--topo-base-rgb');
    const line = rgb('--topo-line-rgb');
    gl.uniform3f(gl.getUniformLocation(program, 'u_base'), base[0], base[1], base[2]);
    gl.uniform3f(gl.getUniformLocation(program, 'u_line'), line[0], line[1], line[2]);
    gl.uniform1f(gl.getUniformLocation(program, 'u_strength'), Number(tokens.getPropertyValue('--topo-line-strength')));
    const speed = Number(tokens.getPropertyValue('--topo-speed'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let elapsed = 0;
    let last = 0;
    let lastPaint = 0;
    let lost = false;
    const paint = () => {
      gl.uniform1f(timeUniform, elapsed);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      canvas.dataset.ready = 'true';
    };
    const render = (now: number) => {
      const delta = last ? Math.min(now - last, 100) : 16;
      if (last) elapsed += delta * 0.001 * speed;
      last = now;
      if (now - lastPaint >= 1000 / 30) { paint(); lastPaint = now; }
      frame = requestAnimationFrame(render);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = 0;
      if (lost || document.hidden) return;
      paint();
      if (!reduced.matches) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      // Bound GPU work on high-density displays; keep an adequate resolution on phones.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25, 1800 / window.innerWidth);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      sync();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      canvas.dataset.ready = 'false';
    };
    const contextRestored = () => setGeneration(value => value + 1);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    canvas.addEventListener('webglcontextlost', contextLost);
    canvas.addEventListener('webglcontextrestored', contextRestored);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      canvas.removeEventListener('webglcontextlost', contextLost);
      canvas.removeEventListener('webglcontextrestored', contextRestored);
      canvas.dataset.ready = 'false';
      dispose();
    };
  }, [generation]);

  return <div className="topo-field" aria-hidden="true"><canvas ref={canvasRef} /><div className="topo-field-shade" /></div>;
}
