type DrawCall = () => void

export abstract class Renderer {
  private gl: WebGL2RenderingContext
  private id = -1
  private drawCalls: DrawCall[] = []

  constructor() {
    const cvs = document.createElement('canvas')
    document.body.appendChild(cvs)
    cvs.width = 640
    cvs.height = 480
    this.gl = cvs.getContext('webgl2')!
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
  }

  public render() {
    this.init(this.gl).then(() => {
      this.start()
    })
  }

  protected drawCall(cb: DrawCall) {
    this.drawCalls.push(cb)
  }

  protected draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    this.drawCalls.forEach((call) => call())
    this.id = window.requestAnimationFrame(() => {
      this.draw()
    })
  }

  protected abstract init(gl: WebGL2RenderingContext): Promise<void>

  private start() {
    this.draw()
  }

  public pause() {
    window.cancelAnimationFrame(this.id)
  }
}
