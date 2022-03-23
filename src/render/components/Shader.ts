enum ShaderType {
  Vert,
  Frag,
  COUNT
}

export class Shader {
  private id: WebGLProgram

  private cache: Map<string, WebGLUniformLocation> = new Map()

  constructor(shader: string, private gl: WebGL2RenderingContext) {
    this.id = gl.createProgram()!
    let type = ShaderType.Vert
    const codes: string[] = new Array(ShaderType.COUNT).fill('')
    const lines = shader.split('\n')
    for (const line of lines) {
      if (line.startsWith('#shader')) {
        if (line.includes('vert')) {
          type = ShaderType.Vert
        } else if (line.includes('frag')) {
          type = ShaderType.Frag
        }
      } else {
        codes[type] += line + '\n'
      }
    }
    this.compile(codes[0], gl.VERTEX_SHADER)
    this.compile(codes[1], gl.FRAGMENT_SHADER)
    gl.linkProgram(this.id)
    this.bind()
  }

  public getId() {
    return this.id
  }

  private getLocation(name: string) {
    let loc: WebGLUniformLocation
    if (this.cache.has(name)) {
      loc = this.cache.get(name)!
    } else {
      loc = this.gl.getUniformLocation(this.id, name)!
      this.cache.set(name, loc)
    }
    return loc
  }

  public setUniform1i(name: string, value: number) {
    this.gl.uniform1i(this.getLocation(name), value)
  }

  public setUniform4f(name: string, x: number, y: number, z: number, w: number) {
    this.gl.uniform4f(this.getLocation(name), x, y, z, w)
  }

  public setUniformMatrix4fv(name: string, data: Float32List) {
    this.gl.uniformMatrix4fv(this.getLocation(name), false, data)
  }

  public bind() {
    this.gl.useProgram(this.id)
  }

  public unbind() {
    this.gl.useProgram(0)
  }

  private compile(code: string, type: number) {
    const gl = this.gl
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader)
      throw 'Could not compile WebGL program. \n\n' + info
    }
    gl.attachShader(this.id, shader)
    gl.deleteShader(shader)
  }
}
