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
    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.clear(GL.COLOR_BUFFER_BIT);
};


const Main = () => {
    CreateProgram();


    /** @desc ссылки на атрибуты в шейдере */
    const a_Position = GL.getAttribLocation(SHADER_PROGRAM, 'a_Position');
    const a_Color = GL.getAttribLocation(SHADER_PROGRAM, 'a_Color');

    /** @desc включаем для атрибутов возможность получения значений из ARRAY_BUFFER */
    GL.enableVertexAttribArray(a_Position);
    GL.enableVertexAttribArray(a_Color);

   /**
    * способов передачи даннфх для атрибутов несколько
    * 1. создаем для каждого атрибута свой буфер и передаем свои значения
    * 2. складываем позиции точек и их цвета в один масив в порядке: позиция,цвет,позиция,цвет,позиция,цвет и т.д
    * */
    const triangle_vertex =
        [
            -0.8, -0.5,     // x,y точки
            0.0, 0.0, 0.5,  // значения цвета точки
            0.0, 0.8,       // x,y точки
            0.5, 0.0, 0.5,  // значения цвета точки
            0.8, -0.5,      // x,y точки
            0.0, 0.5, 0.5   // значения цвета точки
        ];

    const TRIANGLE_VERTEX = GL.createBuffer(); // Создаем буфер

    GL.bindBuffer(GL.ARRAY_BUFFER, TRIANGLE_VERTEX);  // назначаем текущий буфер указывая что это буфер массива
    GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(triangle_vertex), GL.STATIC_DRAW); // указываем тип буфера, данные и тип обработки данных

    ClearCanvas();

    /**
     * как webgl поймет какие данные у нас позиция, а какие цвет?
     * */

    /**
     * stride: 4 * (2 + 3) = 20 байт, где 4 байта размер числа float, 2 кол-во чисел для позиции, 3 кол-во чисел для цвета
     * offset: 0 - отступ от начала
     * */
    GL.vertexAttribPointer(a_Position, 2, GL.FLOAT, false, 4 * (2 + 3), 0);
    /**
     * stride: 4 * (2 + 3) = 20 байт, где 4 байта размер числа float, 2 кол-во чисел для позиции, 3 кол-во чисел для цвета
     * offset: 2 * 4 = 8 байт, отступ от начала массива, где 2, кол-во чисел, а 4 размер в байтах ддя чисел
     * */
    GL.vertexAttribPointer(a_Color, 3, GL.FLOAT, false, 4 * (2 + 3), 2 * 4);
    GL.drawArrays(GL.TRIANGLES, 0, 3); // рисуем треугольник

};

Main();