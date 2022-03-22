export class IndexBuffer {
  private id: WebGLBuffer

  constructor(private data: Int16Array, private gl: WebGL2RenderingContext) {
    this.id = gl.createBuffer()!
    this.bind()
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW)
  }

  public bind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.id)
  }

  public unbind() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 0)
  }

  public draw() {
    this.bind()
    this.gl.drawElements(this.gl.TRIANGLES, this.data.length, this.gl.UNSIGNED_SHORT, 0)
  }
}
