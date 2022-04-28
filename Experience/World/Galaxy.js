import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Galaxy 
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.parameters = {}
        this.parameters.count = 180000
        this.parameters.size = 0.02
        this.parameters.radius = 8
        this.parameters.branches = 6
        this.parameters.spin = 1
        this.parameters.randomness = 0.5
        this.parameters.randomnessPower = 3
        this.parameters.insideColor = '#ff6030'
        this.parameters.outsideColor = '#1b3984'

        this.generateGalaxy()

        
        this.debugFolder = this.debug.ui.addFolder('Galaxy')

            this.debugFolder
                .add(this.parameters, 'count')
                .min(1000)
                .max(1000000)
                .step(1000)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'size')
                .min(0.001)
                .max(0.1)
                .step(0.001)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'radius')
                .min(0.01)
                .max(20)
                .step(0.01)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'branches')
                .min(2)
                .max(20)
                .step(1)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'spin')
                .min(-10)
                .max(10)
                .step(0.01)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'randomness')
                .min(0)
                .max(10)
                .step(0.01)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .add(this.parameters, 'randomnessPower')
                .min(1)
                .max(10)
                .step(0.01)
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .addColor(this.parameters, 'insideColor') 
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })

            this.debugFolder
                .addColor(this.parameters, 'outsideColor') 
                .onFinishChange(() =>
                {
                    this.generateGalaxy()
                })
        
    }

    setGeometry()
    {
        this.geometry = new THREE.BufferGeometry()

        this.positions = new Float32Array(this.parameters.count * 3)

        this.colors = new Float32Array(this.parameters.count * 3)

        const colorInside = new THREE.Color(this.parameters.insideColor)
        const colorOutside = new THREE.Color(this.parameters.outsideColor)

        for (let i = 0; i < this.parameters.count; i++)
        { 
            const i3 = i * 3

            // Position
            const radius = Math.random() * this.parameters.radius
            const branchAngle = (i % this.parameters.branches) / this.parameters.branches * Math.PI * 2
            const spinAngle = radius * this.parameters.spin

            const randomX = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomY = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
            const randomZ = Math.pow(Math.random(), this.parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

            this.positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
            this.positions[i3 + 1] = randomY
            this.positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
        
            // Color
            const mixedColor = colorInside.clone()
            mixedColor.lerp(colorOutside, radius / this.parameters.radius)

            this.colors[i3 + 0] = mixedColor.r
            this.colors[i3 + 1] = mixedColor.g
            this.colors[i3 + 2] = mixedColor.b
        }
  
        this.geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(this.positions, 3)
        )   

        this.geometry.setAttribute(
            'color',
            new THREE.BufferAttribute(this.colors, 3)
        )
    }

    setMaterial()
    {
        this.material = new THREE.PointsMaterial(
            {
                size: this.parameters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            }
        )
    }

    setPoints()
    {
        this.points = new THREE.Points(this.geometry, this.material)
        this.scene.add(this.points)
    }

    generateGalaxy()
    {
        if(this.points)
        {
            this.geometry.dispose()
            this.material.dispose()
            this.scene.remove(this.points)
        }
        
        this.setGeometry()
        this.setMaterial()
        this.setPoints()
    }
}