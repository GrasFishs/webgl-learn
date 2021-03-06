type DrawCall = (timestamp: number) => void

export abstract class Renderer {
  private gl: WebGL2RenderingContext
  private id = -1
  private drawCalls: DrawCall[] = []

  protected width = 640
  protected height = 460

  constructor(cvs: HTMLCanvasElement) {
    cvs.width = this.width
    cvs.height = this.height
    this.gl = cvs.getContext('webgl2')!
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

    this.gl.enable(this.gl.DEPTH_TEST)
    console.log(this.gl.getParameter(this.gl.SHADING_LANGUAGE_VERSION))
  }

  public render() {
    this.clear()
    this.init(this.gl).then(() => {
      this.drawCalls.length > 0 && this.start()
    })
  }

  protected drawCall(cb: DrawCall) {
    this.drawCalls.push(cb)
  }

  protected draw(timestamp: number) {
    this.clear()
    this.drawCalls.forEach((call) => call(timestamp))
    this.id = window.requestAnimationFrame((timestamp) => {
      this.draw(timestamp)
    })
  }

  protected clear() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  protected abstract init(gl: WebGL2RenderingContext): Promise<void>

  private start() {
    this.draw(0)
  }

  public pause() {
    window.cancelAnimationFrame(this.id)
  }
}
