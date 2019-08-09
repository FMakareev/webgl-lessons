

/**
 * gl_PointSize - размер точки в px
 * gl_Position - позиция точки в x,y,z
 * */
const VSHADER_SOURCE = `
void main() {
    gl_PointSize = 20.0;
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

const FSHADER_SOURCE = `
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0, 0.7, 0.0, 1.0);
}
`;


function getShader(gl, id, str) {

    let shader;

    if( id === 'vs'){
        shader = gl.createShader(gl.VERTEX_SHADER); // создаем шейдер
    } else if( id === 'fs') {
        shader = gl.createShader(gl.FRAGMENT_SHADER); // создаем шейдер
    } else {
        return null;
    }

    gl.shaderSource(shader, str); // передаем шейдеру текст программы
    gl.compileShader(shader); // компилируем программу

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;

}

function initShader(gl) {

    const VS = getShader(gl, 'vs', VSHADER_SOURCE); // получаем вершинный шейдер
    const FS = getShader(gl, 'fs', FSHADER_SOURCE); // получаем фрагментный шейдер

    const shaderProgram = gl.createProgram(); // создание шейдерной программы

    gl.attachShader(shaderProgram, VS); // передаем в шейдерную программу шейдер
    gl.attachShader(shaderProgram, FS);// передаем в шейдерную программу шейдер

    gl.linkProgram(shaderProgram); // линковка шейдера вершин и фрагментов
    gl.useProgram(shaderProgram); // загрузка программы в графический конвейер
}


function webGLStart() {
    let canvas = document.getElementById('canvasGL');

    if(!canvas){
        console.error('Failed, canvas not found.');
        return;
    }
    canvas.width = 400;
    canvas.height = 400;

    let gl; // переменная для ссылки на контекст
    try{
        gl = canvas.getContext('webgl', {antialias:false}); // получаем контекст webGL
    } catch(error){
        console.error(error);
        return false;
    }

    initShader(gl);

    gl.clearColor(0.5,0.5,0.5,1.0); // задаем цвет очистки экрана
    gl.clear(gl.COLOR_BUFFER_BIT); // очищаем буфер цвета
    gl.drawArrays(gl.POINTS, 0, 1); // рисуем примитив, в этом случае точка POINTS

}
