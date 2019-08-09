const IDs = {
    canvas: "canvasGL",
    shaders: {
        vertex: 'vertex-shader',
        fragment: 'fragment-shader',
    }
};

const CANVAS = document.getElementById(IDs.canvas);
const GL = CANVAS.getContext("webgl", {antialias: false});
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
        vertex: CompileShader(
            GL.VERTEX_SHADER,
            document.getElementById(IDs.shaders.vertex).textContent
        ),
        fragment: CompileShader(
            GL.FRAGMENT_SHADER,
            document.getElementById(IDs.shaders.fragment).textContent
        ),
    }
};

const CompileShader = (type, source) => {
    const shader = GL.createShader(type);
    GL.shaderSource(shader, source);
    GL.compileShader(shader);

    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        console.error(GL.getShaderInfoLog(shader));
        return null;
    }
    return shader;
};

const ClearCanvas = () => {
    GL.clearColor(0.26, 1, 0.93, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
};



const OnMouseClick = (g_Points, a_Position) => (event) => {

    /** @desc вычисляем позицию клика на полотне */
    let windowX = event.clientX;
    let windowY = event.clientY;

    let canvasRect = event.target.getBoundingClientRect();

    let canvasHalfWidth = CANVAS.width / 2;
    let canvasHalfHeight = CANVAS.height / 2;

    let canvasX = ((windowX - canvasRect.left) - canvasHalfWidth) / canvasHalfWidth;
    let canvasY = (canvasHalfHeight - (windowY - canvasRect.top)) / canvasHalfHeight;

    /** @desc добавляем полученные координаты в массив*/
    g_Points.push(canvasX);
    g_Points.push(canvasY);

    /** @desc очищаем канвас */
    GL.clear(GL.COLOR_BUFFER_BIT);

    /** @desc рисуем точки */
    const g_PointsLen = g_Points.length;

    for (let i = 0; i < g_PointsLen; i += 2) {
        GL.vertexAttrib3f(a_Position, g_Points[i], g_Points[i+1],0.0);
        GL.drawArrays(GL.POINTS,0,1);
    }

};

const Main = () => {
    CreateProgram();

    /** @desc ссылки на атрибуты в шейдере */
    let a_Position = GL.getAttribLocation(SHADER_PROGRAM, 'a_Position');
    let a_PointSize = GL.getAttribLocation(SHADER_PROGRAM, 'a_PointSize');

    GL.vertexAttrib1f(a_PointSize, 50.0);
    // GL.vertexAttrib3f(a_Position, 0.5, 0.5, 0.5);

    /** @desc ссылка на юниформ атрибут в шейдере*/
    let u_FragColor = GL.getUniformLocation(SHADER_PROGRAM, 'u_FragColor');
    GL.uniform4f(u_FragColor, 0.9, 0.5, 0.0, 1.0);

    ClearCanvas();

    let g_Points = [];
    CANVAS.addEventListener('click', OnMouseClick(g_Points, a_Position));

};

Main();