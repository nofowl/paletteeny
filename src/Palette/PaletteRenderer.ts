import { Palette } from "./Palettes"
import React from "react"
import { SERVFAIL } from "dns";
import { palette } from "@mui/system";

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
    canvasHeight: number
  };

type Buffers = {
    position: WebGLBuffer | null
};

export class PaletteRenderer
{
    canvasGLRef: React.MutableRefObject<HTMLCanvasElement | null>;
    canvasGLContext: React.MutableRefObject<WebGLRenderingContext | null>;
    canvas2DRef: React.MutableRefObject<HTMLCanvasElement | null>;
    canvas2DContext: React.MutableRefObject<CanvasRenderingContext2D | null>;
    palette: Palette;

    constructor(
        canvasGLRef: React.MutableRefObject<HTMLCanvasElement | null>,
        canvasGLContext: React.MutableRefObject<WebGLRenderingContext | null>,
        canvas2DRef: React.MutableRefObject<HTMLCanvasElement | null>,
        canvas2DContext: React.MutableRefObject<CanvasRenderingContext2D | null>,
        palette: Palette)
    {
        this.canvasGLRef = canvasGLRef;
        this.canvasGLContext = canvasGLContext;
        this.canvas2DRef = canvas2DRef;
        this.canvas2DContext = canvas2DContext;
        this.palette = palette;
    }

    initBuffers(gl: WebGLRenderingContext) : Buffers{
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

    loadShader(gl: WebGLRenderingContext, type: number, source: string) : WebGLShader | null {
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

    initShaderProgram(gl: WebGLRenderingContext, vert: string, frag: string) : WebGLProgram | null {
        const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vert);
        const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, frag);

        let shaderProgram = gl.createProgram();

        if (shaderProgram && vertexShader && fragmentShader)
        {
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
                return null;
            }
        }
        else
        {
            alert('Unable to construct program or shaders.');
            return null;
        }

        return shaderProgram;
    }

    drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
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
                offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
        }

        gl.useProgram(programInfo.program);

        // bind uniforms
        gl.uniform4fv(programInfo.uniformLocations.tlPos, this.palette.tl.asArray());
        gl.uniform4fv(programInfo.uniformLocations.trPos, this.palette.tr.asArray());
        gl.uniform4fv(programInfo.uniformLocations.blPos, this.palette.bl.asArray());
        gl.uniform4fv(programInfo.uniformLocations.brPos, this.palette.br.asArray());
        gl.uniform2fv(programInfo.uniformLocations.sizePos, [programInfo.canvasWidth, programInfo.canvasHeight]);

        const offset = 0;
        const vertexCount = 4;
        gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

    renderGL(width: number, height: number) {
        if (this.canvasGLRef.current)
        {
            this.canvasGLRef.current.width = width;
            this.canvasGLRef.current.height = height;

            this.canvasGLContext.current = this.canvasGLRef.current.getContext('webgl', {preserveDrawingBuffer: true});

            let context = this.canvasGLContext.current;

            if (context === null) {
                alert("Unable to initialize WebGL. Your browser or machine may not support it.");
                return;
            }

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

            const shaderProgram = this.initShaderProgram(context, vert, frag);

            if (shaderProgram === null)  return;

            const programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: context.getAttribLocation(shaderProgram, 'aVertexPosition'),
                },
                uniformLocations: {
                    tlPos: context.getUniformLocation(shaderProgram, 'tl'),
                    trPos: context.getUniformLocation(shaderProgram, 'tr'),
                    blPos: context.getUniformLocation(shaderProgram, 'bl'),
                    brPos: context.getUniformLocation(shaderProgram, 'br'),
                    sizePos: context.getUniformLocation(shaderProgram, "size")
                },
                canvasWidth: width,
                canvasHeight: height
            };

            const buffers = this.initBuffers(context);

            this.drawScene(context, programInfo, buffers);
        }
    }

    renderText(width: number, height: number) {
        if (this.canvas2DRef.current)
        {
            this.canvas2DRef.current.width = width;
            this.canvas2DRef.current.height = height;

            this.canvas2DContext.current = this.canvas2DRef.current.getContext('2d');

            let context = this.canvas2DContext.current;

            if (context === null) {
                alert("Unable to initialize text canvas.");
                return;
            }

            context.clearRect(0, 0, width, height);

            if (this.canvasGLRef.current) {
                context.drawImage(this.canvasGLRef.current, 0, 0);
            }

            context.font = 'bold 20px segoe ui';
            context.fillStyle = "white";

            context.globalCompositeOperation = 'soft-light';

            // top
            context.textBaseline = 'top';
            context.textAlign = 'left';
            context.fillText('#' + this.palette.tl.asHex(), 16, 16);
            context.textAlign = 'right';
            context.fillText('#' + this.palette.tr.asHex(), width - 16, 16);

            // bottom
            context.textBaseline = 'bottom';
            context.textAlign = 'left';
            context.fillText('#' + this.palette.bl.asHex(), 16, height - 16);
            context.textAlign = 'right';
            context.fillText('#' + this.palette.br.asHex(), width - 16, height - 16);
        }
    }

    render(width: number, height: number, renderText: boolean = false) {
        this.renderGL(width, height);

        if (renderText) {
            this.renderText(width, height);
        }
    }

    saveImage(width: number, height: number) : string {
        this.render(width, height, true);

        if (this.canvas2DRef.current) {
            return this.canvas2DRef.current.toDataURL("image/png");
        }

        return "";
        // let url = this.canvas2DRef.current?.toDataURL("image/png");
        // if (url) {
        //     var image = new Image();
        //     image.src = url;
    
        //     var w = window.open("");
        //     w!.document.title="Paleteeny output";
        //     w!.document.write(image.outerHTML);
        // }

        // // clear the render
        // this.render(width, height);
    }
}