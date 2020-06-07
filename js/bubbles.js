class BGBubble {
    constructor(userNum) {
        this.userOpts = {
            num: userNum ? parseInt(userNum) : 10, // 个数
            radius_min: 1, // 初始半径最小值
            radius_max: 2, // 初始半径最大值
            radius_add_min: 0.3, // 半径增加最小值
            radius_add_max: 0.5, // 半径增加最大值
            opacity_min: 0.3, // 初始透明度最小值
            opacity_max: 0.5, // 初始透明度最大值
            opacity_prev_min: 0.003, // 透明度递减值最小值
            opacity_prev_max: 0.005, // 透明度递减值最大值
            light_min: 40, // 颜色亮度最小值
            light_max: 70, // 颜色亮度最大值
            is_same_color: false //泡泡颜色是否相同
        }
        this.color = this.random(0, 360)
        this.bubbleNum = []
        this.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
        this.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame
        if (!document.getElementById('myBubbles')) {
            this.createCanvas()
            this.start()
        }
    }

    random(a, b) {
        return Math.random() * (b - a) + a //取a-b之间的随机值
    }

    initBubble(color, isSameColor) {
        const width = window.innerWidth
        const height = window.innerHeight
        const userOpts = this.userOpts
        const light = this.random(userOpts.light_min, userOpts.light_max)
        this.bubble = {
            x: this.random(0, width),
            y: this.random(0, height),
            radius: this.random(userOpts.radius_min, userOpts.radius_max),
            radiusChange: this.random(userOpts.radius_add_min, userOpts.radius_add_max),
            opacity: this.random(userOpts.opacity_min, userOpts.opacity_max),
            opacityChange: this.random(userOpts.opacity_prev_min, userOpts.opacity_prev_max),
            light,
            color: `hsl(${isSameColor ? color : this.random(0, 360)},100%,${light}%)`
        }
    }

    bubbling(ctx, color, isSameColor) {
        !this.bubble && this.initBubble(color, isSameColor)
        const bubble = this.bubble
        ctx.fillStyle = bubble.color
        ctx.globalAlpha = bubble.opacity
        ctx.beginPath()
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.fill()
        ctx.globalAlpha = 1
        bubble.opacity -= bubble.opacityChange
        bubble.radius += bubble.radiusChange
        if (bubble.opacity <= 0) {
            this.initBubble(color, isSameColor)
            return
        }
    }

    createCanvas() {
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'myBubbles'
        this.canvas.style.display = 'block' //防止全屏的canvas出现滚动条
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.canvas.style.position = 'fixed'
        this.canvas.style.top = '0'
        this.canvas.style.left = '0'
        this.canvas.style.zIndex = '-1'
        this.ctx = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        window.onresize = () => {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
        }
    }

    start() {
        const width = window.innerWidth
        const height = window.innerHeight
        this.color += 0.1
        this.ctx.fillStyle = `#fff`
        this.ctx.fillRect(0, 0, width, height)
        if (this.bubbleNum.length < this.userOpts.num) {
            this.bubbleNum.push(new BGBubble())
        }
        this.bubbleNum.forEach(bubble => bubble.bubbling(this.ctx, this.color, this.userOpts.is_same_color))
        const requestAnimationFrame = this.requestAnimationFrame
        this.myReq = requestAnimationFrame(() => this.start()) //新的动画API可根据浏览设置最佳动画间隔时间
    }

    destory() {
        const cancelAnimationFrame = this.cancelAnimationFrame
        cancelAnimationFrame(this.myReq)
        window.onresize = null
    }
}
