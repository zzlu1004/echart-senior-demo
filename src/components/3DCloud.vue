<template>
  <div>
    <canvas ref="canvasOne" :width="width+'px'" :height="height+'px'" ></canvas>
  </div>
</template>

<script>
  export default {
    name: 'FdCloud',
    components: {},
    props: {
      codes: {
        type: Array
      },
      width: {
        type: String,
        default: '500'
      },
      height: {
        type: String,
        default: '400'
      }
    },
    data() {
      return {
        sphereRad: 280,
        radius_sp: 1,
        modernizr: {},
        opt_display_dots: false,
        wait: 1,
        count: 0,
        numToAddEachFrame: 3,
        particleAlpha: 1,
        projCenterX: 0,
        projCenterY: 0,
        fLen: 320, // represents the distance from the viewer to z=0 depth.
        zMax: 100, // we will not draw coordinates if they have too large of a z-coordinate (which means they are very close to the observer).
        rgbString: 'rgba(70, 255, 140, ',
        particleList: {},
        recycleBin: {},
        // random acceleration factors - causes some random motion
        randAccelX: 0.1,
        randAccelY: 0.1,
        randAccelZ: 0.1,
        rotX: 0,
        rotZ: 0,
        gravity: 0, // try changing to a positive number (not too large, for example 0.3), or negative for floating upwards.
        particleRad: 2.5,
        sphereCenterX: 0,
        sphereCenterY: 0,
        sphereCenterZ: -283,
        // alpha values will lessen as particles move further back, causing depth-based darkening:
        zeroAlphaDepth: -750,
        turnSpeed: 1 * Math.PI / 1200, // the sphere will rotate at this speed (one complete rotation every 1600 frames).
        turnAngle: 0, // initial angle
        sinAngle: Math.sin(0),
        cosAngle: Math.cos(0),
        context: null,
        p: null,
        timer: null
      }
    },
    computed: {},
    mounted() {
      this.canvasApp()
    },
    methods: {
      canvasApp() {
        const theCanvas = this.$refs.canvasOne
        this.context = theCanvas.getContext('2d')
        this.init()
      },
      init() {
        this.count = this.wait - 1
        // projection center coordinates sets location of origin
        this.projCenterX = this.width / 2
        this.projCenterY = this.height / 2
        this.zMax = this.fLen - 2
        this.timer = setInterval(() => {
          this.onTimer()
        }, 20 / 24)
      },
      onTimer() {
        // if enough time has elapsed, we will add new particles.
        this.count++
        if (this.count >= this.wait) {
          this.count = 0
          for (let i = 0; i < this.numToAddEachFrame; i++) {
            const theta = Math.random() * 2 * Math.PI
            const phi = Math.acos(Math.random() * 2 - 1)
            const x0 = this.sphereRad * Math.sin(phi) * Math.cos(theta)
            const y0 = this.sphereRad * Math.sin(phi) * Math.sin(theta)
            const z0 = this.sphereRad * Math.cos(phi)
            this.p = this.addParticle(x0, this.sphereCenterY + y0, this.sphereCenterZ + z0, 0.002 * x0, 0.002 * y0, 0.002 * z0)
            // we set some "envelope" parameters which will control the evolving alpha of the particles.
            this.p.attack = 30
            this.p.hold = 30
            this.p.decay = 100
            this.p.initValue = 0
            this.p.holdValue = this.particleAlpha
            this.p.lastValue = 0

            // the particle will be stuck in one place until this time has elapsed:
            this.p.stuckTime = 90 + Math.random() * 20

            this.p.accelX = 0
            this.p.accelY = this.gravity
            this.p.accelZ = 0
          }
        }
        // update viewing angle
        this.turnAngle = (this.turnAngle + this.turnSpeed) % (2 * Math.PI)
        this.sinAngle = Math.sin(this.turnAngle)
        this.cosAngle = Math.cos(this.turnAngle)
        // background fill
        this.context.fillStyle = '#091d34'
        this.context.fillRect(0, 0, this.width, this.height)
        // update and draw particles
        this.p = this.particleList.first
        while (this.p != null) {
          // before list is altered record next particle
          this.nextParticle = this.p.next
          // update age
          this.p.age++
          // if the particle is past its "stuck" time, it will begin to move.
          if (this.p.age > this.p.stuckTime) {
            this.p.velX += this.p.accelX + this.randAccelX * (Math.random() * 2 - 1)
            this.p.velY += this.p.accelY + this.randAccelY * (Math.random() * 2 - 1)
            this.p.velZ += this.p.accelZ + this.randAccelZ * (Math.random() * 2 - 1)

            this.p.x += this.p.velX
            this.p.y += this.p.velY
            this.p.z += this.p.velZ
          }

          /*
           We are doing two things here to calculate display coordinates.
           The whole display is being rotated around a vertical axis, so we first calculate rotated coordinates for
           x and z (but the y coordinate will not change).
           Then, we take the new coordinates (rotX, y, rotZ), and project these onto the 2D view plane.
           */
          this.rotX = this.cosAngle * this.p.x + this.sinAngle * (this.p.z - this.sphereCenterZ)
          this.rotZ = -this.sinAngle * this.p.x + this.cosAngle * (this.p.z - this.sphereCenterZ) + this.sphereCenterZ
          const m = this.radius_sp * this.fLen / (this.fLen - this.rotZ)
          this.p.projX = this.rotX * m + this.projCenterX
          this.p.projY = this.p.y * m + this.projCenterY

          // update alpha according to envelope parameters.
          if (this.p.age < this.p.attack + this.p.hold + this.p.decay) {
            if (this.p.age < this.p.attack) {
              this.p.alpha = (this.p.holdValue - this.p.initValue) / this.p.attack * this.p.age + this.p.initValue
            } else if (this.p.age < this.p.attack + this.p.hold) {
              this.p.alpha = this.p.holdValue
            } else if (this.p.age < this.p.attack + this.p.hold + this.p.decay) {
              this.p.alpha = (this.p.lastValue - this.p.holdValue) / this.p.decay * (this.p.age - this.p.attack - this.p.hold) + this.p.holdValue
            }
          } else {
            this.p.dead = true
          }

          // see if the particle is still within the viewable range.
          if ((this.p.projX > this.width) ||
            (this.p.projX < 0) ||
            (this.p.projY < 0) ||
            (this.p.projY > this.height) ||
            (this.rotZ > this.zMax)) {
            this.outsideTest = true
          } else {
            this.outsideTest = false
          }

          if (this.outsideTest || this.p.dead) {
            this.recycle(this.p)
          } else {
            // depth-dependent darkening
            this.depthAlphaFactor = (1 - this.rotZ / this.zeroAlphaDepth)
            this.depthAlphaFactor = (this.depthAlphaFactor > 1) ? 1 : ((this.depthAlphaFactor < 0) ? 0 : this.depthAlphaFactor)
            this.context.fillStyle = this.rgbString + this.depthAlphaFactor * this.p.alpha + ')'
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            this.context.font = (this.p.size < 10 ? 10 : (this.p.size > 16 ? 16 : this.p.size)) + 'px sans-serif'
            this.context.fillText(this.p.flake, this.p.projX, this.p.projY)
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            /* ADD TEXT function! */
            // draw
            this.context.beginPath()
            if (this.opt_display_dots) {
              this.context.arc(this.p.projX, this.p.projY, m * this.particleRad, 0, 2 * Math.PI, false)
            }
            this.context.closePath()
            this.context.fill()
          }

          this.p = this.nextParticle
        }
      },
      addParticle(x0, y0, z0, vx0, vy0, vz0) {
        let newParticle = {}
        // check recycle bin for available drop:
        if (this.recycleBin.first != null) {
          newParticle = this.recycleBin.first
          // remove from bin
          if (newParticle.next != null) {
            this.recycleBin.first = newParticle.next
            newParticle.next.prev = null
          } else {
            this.recycleBin.first = null
          }
        } else { // if the recycle bin is empty, create a new particle (a new ampty object):
          newParticle = {}
        }
        // add to beginning of particle list
        if (this.particleList.first == null) {
          this.particleList.first = newParticle
          newParticle.prev = null
          newParticle.next = null
        } else {
          newParticle.next = this.particleList.first
          this.particleList.first.prev = newParticle
          this.particleList.first = newParticle
          newParticle.prev = null
        }
        // initialize
        newParticle.x = x0
        newParticle.y = y0
        newParticle.z = z0
        newParticle.velX = vx0
        newParticle.velY = vy0
        newParticle.velZ = vz0
        newParticle.age = 0
        newParticle.dead = false
        const font = this.codes[Math.floor(Math.random() * this.codes.length)]
        newParticle.flake = font.name
        newParticle.size = font.weight
        if (Math.random() < 0.5) {
          newParticle.right = true
        } else {
          newParticle.right = false
        }
        return newParticle
      },
      recycle(p) {
        // remove from particleList
        if (this.particleList.first === this.p) {
          if (this.p.next != null) {
            p.next.prev = null
            this.particleList.first = this.p.next
          } else {
            this.particleList.first = null
          }
        } else {
          if (this.p.next == null) {
            this.p.prev.next = null
          } else {
            this.p.prev.next = this.p.next
            this.p.next.prev = this.p.prev
          }
        }
        // add to recycle bin
        if (this.recycleBin.first == null) {
          this.recycleBin.first = this.p
          this.p.prev = null
          this.p.next = null
        } else {
          this.p.next = this.recycleBin.first
          this.recycleBin.first.prev = this.p
          this.recycleBin.first = this.p
          this.p.prev = null
        }
      }
    }
  }
</script>

<style scoped>
</style>

