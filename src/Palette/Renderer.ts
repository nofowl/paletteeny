import { Palette } from "./Palettes";

type ProgramInfo = {
  program: WebGLProgram | null,
  attribLocations: {
    vertexPosition: number,
  },
  uniformLocations: {
    tlPos: WebGLUniformLocation | null,
    trPos: WebGLUniformLocation | null,
    blPos: WebGLUniformLocation | null,
    brPos: WebGLUniformLocation | null,
    sizePos: WebGLUniformLocation | null
  },
  canvasWidth: number,
  canvasHeight: number,
};

type Buffers = {
  position: WebGLBuffer | null,
};

function initBuffers(gl: WebGLRenderingContext) : Buffers {
  const positionBuffer = gl.createBuffer();
  
  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0,
  ];
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
  return {
    position: positionBuffer,
  };
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string) : WebGLShader | null {
  let shader = gl.createShader(type);
  
  if (shader) {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  return null;
}

function initShaderProgram(gl: WebGLRenderingContext, vert: string, frag: string) : WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vert);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, frag);
  
  let shaderProgram = gl.createProgram();

  if (!shaderProgram || !vertexShader || !fragmentShader) {
    alert('Unable to construct program or shaders.');
    return null;
  }
  
  if (shaderProgram && vertexShader && fragmentShader) {
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
  }
  
  return shaderProgram;
}

function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers, palette: Palette) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }
  
  gl.useProgram(programInfo.program);
  
  // bind uniforms
  gl.uniform4fv(programInfo.uniformLocations.tlPos, palette.tl.asArray());
  gl.uniform4fv(programInfo.uniformLocations.trPos, palette.tr.asArray());
  gl.uniform4fv(programInfo.uniformLocations.blPos, palette.bl.asArray());
  gl.uniform4fv(programInfo.uniformLocations.brPos, palette.br.asArray());
  gl.uniform2fv(programInfo.uniformLocations.sizePos, [programInfo.canvasWidth, programInfo.canvasHeight]);
  
  const offset = 0;
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
}

export function renderGL(ctx: WebGLRenderingContext, width: number, height: number, palette: Palette) {
  const vert = `
    attribute vec4 aVertexPosition;
    
    void main() {
      gl_Position = aVertexPosition;
    }
  `;
  
  const frag = `
    precision highp float;
    uniform vec2 size;
    uniform vec4 tl;
    uniform vec4 tr;
    uniform vec4 bl;
    uniform vec4 br;
    
    void main() {
      vec4 top = mix(tl, tr, gl_FragCoord.x / size.x);
      vec4 bottom = mix(bl, br, gl_FragCoord.x / size.x);
      gl_FragColor = mix(bottom, top, gl_FragCoord.y / size.y);
    }
  `;
  
  const shaderProgram = initShaderProgram(ctx, vert, frag);
  
  if (shaderProgram === null)  return;
  
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: ctx.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      tlPos: ctx.getUniformLocation(shaderProgram, 'tl'),
      trPos: ctx.getUniformLocation(shaderProgram, 'tr'),
      blPos: ctx.getUniformLocation(shaderProgram, 'bl'),
      brPos: ctx.getUniformLocation(shaderProgram, 'br'),
      sizePos: ctx.getUniformLocation(shaderProgram, "size")
    },
    canvasWidth: width,
    canvasHeight: height
  };
  
  const buffers = initBuffers(ctx);
  
  drawScene(ctx, programInfo, buffers, palette);
}

export function renderText(ctx: CanvasRenderingContext2D, width: number, height: number, palette: Palette) {
  ctx.font = 'bold 20px segoe ui';
  ctx.fillStyle = "white";
  
  ctx.globalCompositeOperation = 'soft-light';
  
  // top
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('#' + palette.tl.asHex(), 16, 16);
  ctx.textAlign = 'right';
  ctx.fillText('#' + palette.tr.asHex(), width - 16, 16);
  
  // bottom
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText('#' + palette.bl.asHex(), 16, height - 16);
  ctx.textAlign = 'right';
  ctx.fillText('#' + palette.br.asHex(), width - 16, height - 16);
}
