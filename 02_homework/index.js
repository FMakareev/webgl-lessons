
const IDs = {
    canvas: "canvasGL",
    shaders:{
        vertex: 'vertex-shader',
        fragment: 'fragment-shader',
    }
};

const CANVAS = document.getElementById(IDs.canvas);
const GL = CANVAS.getContext("webgl", {antialias:false});
let SHADER_PROGRAM = null;



const CreateProgram = () => {
    const shaders = GetShaders();
    console.log(shaders);
    SHADER_PROGRAM = GL.createProgram();

    GL.attachShader(SHADER_PROGRAM, shaders.vertex);
    GL.attachShader(SHADER_PROGRAM, shaders.fragment);

    GL.linkProgram(SHADER_PROGRAM);
    GL.useProgram(SHADER_PROGRAM);

};

const GetShaders = () => {
    return {
        vertex:CompileShader(
            GL.VERTEX_SHADER,
            document.getElementById(IDs.shaders.vertex).textContent
        ),
        fragment:CompileShader(
            GL.FRAGMENT_SHADER,
            document.getElementById(IDs.shaders.fragment).textContent
        ),
    }
};

const CompileShader = (type, source) => {
    const shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);

    if(!GL.getShaderParameter(shader, GL.COMPILE_STATUS)){
        console.error(GL.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

const ClearCanvas = ()=> {
    GL.clearColor(0.26, 1, 0.93, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
};

const Main = () => {
    CreateProgram();

    let a_Position = GL.getAttribLocation(SHADER_PROGRAM, 'a_Position');
    let a_PointSize = GL.getAttribLocation(SHADER_PROGRAM, 'a_PointSize');

    GL.vertexAttrib1f(a_PointSize, 50.0);
    GL.vertexAttrib3f(a_Position, 0.5,0.5,0.5);

    ClearCanvas();
    GL.drawArrays(GL.POINTS, 0,1);

};

Main();