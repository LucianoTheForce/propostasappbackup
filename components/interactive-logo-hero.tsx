"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useRef, useState, useEffect, useMemo } from "react"
import * as THREE from "three"

// Constantes de física
// Funções de easing personalizadas
const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3)
const easeInOutQuad = (x: number): number => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2)

// Função de padrão de respiração com mais intensidade
function breathingPattern(time: number, cycleLength = 4): number {
  const normalizedTime = (time % cycleLength) / cycleLength
  if (normalizedTime < 0.33) {
    const inhaleFactor = normalizedTime / 0.33
    return easeOutCubic(inhaleFactor) * 0.3 + 0.9 // Maior variação: 0.9 a 1.2
  } else {
    const exhaleFactor = (normalizedTime - 0.33) / 0.67
    return (1 - easeInOutQuad(exhaleFactor)) * 0.3 + 0.9 // Maior variação: 1.2 a 0.9
  }
}

// Constantes de física igual ao código de referência
const PHYSICS_CONSTANTS = {
  DRAG_SENSITIVITY: 4.0,
  INERTIA: 0.95,
  TRANSITION_SPEED: 0.2,
  INTERACTION_SPEED_MULTIPLIER: 8.0,
  IMPULSE_RETENTION: 0.7,
  MIN_VELOCITY: 0.001,
  BREATHING_CYCLE_LENGTH: 4,
  LERP_FACTOR: 0.1,
}
const BREATHING_CYCLE_DURATION = 4000

interface InteractionState {
  isDragging: boolean
  lastPosition: { x: number; y: number }
  velocity: { x: number; y: number }
  rotation: { x: number; y: number }
  targetRotation: { x: number; y: number }
}

// Componente do logo simplificado - apenas círculo central e aro
function GeneratedLogo() {
  return (
    <group>
      {/* Aro externo */}
      <mesh>
        <torusGeometry args={[1.0, 0.12, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Círculo central */}
      <mesh>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={1.0}
          roughness={0.0}
          envMapIntensity={2.0}
          emissive="#ffffff"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  )
}

function InteractiveLogo() {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Group>(null)
  const { gl, camera } = useThree()
  
  // Sistema de rotação igual ao código de referência
  const rotation = useRef({ x: 0, y: 0, z: 0 })
  const rotationVelocity = useRef({ x: 0.002, y: 0.003, z: 0.001 })
  const orbitalVelocity = useRef({ x: 0.003, y: 0.004, z: 0.002 })
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })
  const lastInteractionTime = useRef(0)
  const interactionStrength = useRef(0)
  const prevRotationVelocity = useRef({ x: 0, y: 0, z: 0 })

  // Detecção de dispositivos touch
  const isTouchDevice = useMemo(() => {
    if (typeof window === "undefined") return false
    return "ontouchstart" in window || navigator.maxTouchPoints > 0
  }, [])

  // Estado para controlar hover
  const [isHovered, setIsHovered] = useState(false)


  // Funções de interação específicas do modelo
  const handlePointerDown = (e: any) => {
    isDragging.current = true
    lastInteractionTime.current = Date.now() / 1000
    interactionStrength.current = 0
    
    // Capturar posição inicial
    lastMousePos.current = {
      x: e.clientX || (e.touches && e.touches[0]?.clientX) || 0,
      y: e.clientY || (e.touches && e.touches[0]?.clientY) || 0,
    }
    
    // Prevenir propagação para evitar scroll
    e.stopPropagation()
  }

  const handlePointerMove = (e: any) => {
    if (!isDragging.current) return
    
    const currentX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
    const currentY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0

    const deltaX = currentX - lastMousePos.current.x
    const deltaY = currentY - lastMousePos.current.y

    const moveMagnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    interactionStrength.current = Math.min(1, interactionStrength.current + moveMagnitude * 0.01)

    const easedStrength = easeOutCubic(interactionStrength.current)

    rotationVelocity.current.y =
      deltaX * 0.001 * PHYSICS_CONSTANTS.DRAG_SENSITIVITY * PHYSICS_CONSTANTS.INTERACTION_SPEED_MULTIPLIER * easedStrength

    rotationVelocity.current.x =
      -deltaY * 0.001 * PHYSICS_CONSTANTS.DRAG_SENSITIVITY * PHYSICS_CONSTANTS.INTERACTION_SPEED_MULTIPLIER * easedStrength

    rotationVelocity.current.z =
      (Math.abs(deltaX) + Math.abs(deltaY)) * 0.0005 * PHYSICS_CONSTANTS.INTERACTION_SPEED_MULTIPLIER * easedStrength

    lastMousePos.current = { x: currentX, y: currentY }
    lastInteractionTime.current = Date.now() / 1000
  }

  const handlePointerUp = () => {
    isDragging.current = false
    lastInteractionTime.current = Date.now() / 1000

    rotationVelocity.current = {
      x: rotationVelocity.current.x * PHYSICS_CONSTANTS.IMPULSE_RETENTION,
      y: rotationVelocity.current.y * PHYSICS_CONSTANTS.IMPULSE_RETENTION,
      z: rotationVelocity.current.z * PHYSICS_CONSTANTS.IMPULSE_RETENTION,
    }
  }

  // Event listeners globais apenas para capturar movimento e soltar
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) {
        handlePointerMove(e)
      }
    }
    
    const handleGlobalUp = () => {
      if (isDragging.current) {
        handlePointerUp()
      }
    }

    window.addEventListener("mousemove", handleGlobalMove)
    window.addEventListener("mouseup", handleGlobalUp)
    window.addEventListener("touchmove", handleGlobalMove, { passive: true })
    window.addEventListener("touchend", handleGlobalUp)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove)
      window.removeEventListener("mouseup", handleGlobalUp)
      window.removeEventListener("touchmove", handleGlobalMove)
      window.removeEventListener("touchend", handleGlobalUp)
    }
  }, [])

  // Loop principal de animação igual ao código de referência
  useFrame((state, delta) => {
    if (!groupRef.current) return

    const currentTime = state.clock.getElapsedTime()
    const timeSinceInteraction = currentTime - lastInteractionTime.current

    // Sistema de física quando não está arrastando
    if (!isDragging.current) {
      // Aplicar inércia
      rotationVelocity.current.x *= PHYSICS_CONSTANTS.INERTIA
      rotationVelocity.current.y *= PHYSICS_CONSTANTS.INERTIA
      rotationVelocity.current.z *= PHYSICS_CONSTANTS.INERTIA

      // Transição suave para velocidade orbital
      if (timeSinceInteraction > 0.5) {
        rotationVelocity.current.x += (orbitalVelocity.current.x - rotationVelocity.current.x) * PHYSICS_CONSTANTS.TRANSITION_SPEED
        rotationVelocity.current.y += (orbitalVelocity.current.y - rotationVelocity.current.y) * PHYSICS_CONSTANTS.TRANSITION_SPEED
        rotationVelocity.current.z += (orbitalVelocity.current.z - rotationVelocity.current.z) * PHYSICS_CONSTANTS.TRANSITION_SPEED
      }

      // Garantir velocidade mínima
      if (Math.abs(rotationVelocity.current.x) < Math.abs(orbitalVelocity.current.x)) {
        rotationVelocity.current.x = orbitalVelocity.current.x
      }
      if (Math.abs(rotationVelocity.current.y) < Math.abs(orbitalVelocity.current.y)) {
        rotationVelocity.current.y = orbitalVelocity.current.y
      }
      if (Math.abs(rotationVelocity.current.z) < Math.abs(orbitalVelocity.current.z)) {
        rotationVelocity.current.z = orbitalVelocity.current.z
      }
    }

    // Atualização de rotação com delta time
    rotation.current.x += rotationVelocity.current.x * delta * 60
    rotation.current.y += rotationVelocity.current.y * delta * 60
    rotation.current.z += rotationVelocity.current.z * delta * 60

    // Aplicar rotação com LERP e rotação inicial de 90°
    groupRef.current.rotation.x += (rotation.current.x + Math.PI / 2 - groupRef.current.rotation.x) * PHYSICS_CONSTANTS.LERP_FACTOR
    groupRef.current.rotation.y += (rotation.current.y - groupRef.current.rotation.y) * PHYSICS_CONSTANTS.LERP_FACTOR
    groupRef.current.rotation.z += (rotation.current.z - groupRef.current.rotation.z) * PHYSICS_CONSTANTS.LERP_FACTOR

    // Sistema de respiração usando a função do código de referência
    const breathScale = breathingPattern(currentTime, PHYSICS_CONSTANTS.BREATHING_CYCLE_LENGTH)
    const interactionBoost = isDragging.current ? 0.2 : 0
    const targetScale = breathScale + interactionBoost
    
    // Debug: log da respiração a cada 2 segundos (removido para produção)
    // if (Math.floor(currentTime * 0.5) % 2 === 0 && Math.floor(currentTime * 10) % 10 === 0) {
    //   console.log('Breathing scale:', breathScale, 'Final scale will be:', targetScale * 1.8)
    // }

    // Calcular escala responsiva - ainda menor
    const viewportSize = typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) : 800
    const baseScale = viewportSize * 0.002 // Reduzido ainda mais
    const responsiveScale = Math.max(baseScale, 1.8) // Base de apenas 1.8x
    const finalScale = targetScale * responsiveScale

    // Aplicar escala com LERP
    groupRef.current.scale.x += (finalScale - groupRef.current.scale.x) * PHYSICS_CONSTANTS.LERP_FACTOR
    groupRef.current.scale.y += (finalScale - groupRef.current.scale.y) * PHYSICS_CONSTANTS.LERP_FACTOR
    groupRef.current.scale.z += (finalScale - groupRef.current.scale.z) * PHYSICS_CONSTANTS.LERP_FACTOR

    // Animação do anel
    if (ringRef.current) {
      const ringSpeed = isDragging.current ? 0.005 : 0.002
      ringRef.current.rotation.z += ringSpeed * delta * 60
    }
  })

  return (
    <group>
      <group 
        ref={groupRef} 
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setIsHovered(true)}
        onPointerOut={() => setIsHovered(false)}
      >
        <GeneratedLogo />
        <group ref={ringRef}>
          {/* Grupo para animações adicionais */}
        </group>
      </group>
    </group>
  )
}

function Lighting() {
  return (
    <>
      {/* Luz ambiente para iluminação base */}
      <ambientLight intensity={0.6} />
      
      {/* Spot light com sombras */}
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Point light para preenchimento */}
      <pointLight position={[-10, 0, -10]} intensity={0.5} />
      <pointLight position={[0, -10, 5]} intensity={0.3} />
      
      {/* Ambiente HDRI de estúdio para reflexões limpas */}
      <Environment preset="studio" />
    </>
  )
}

interface InteractiveLogoHeroProps {
  className?: string
}

export function InteractiveLogoHero({ className = "" }: InteractiveLogoHeroProps) {
  const [isWebGLSupported, setIsWebGLSupported] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Detectar suporte WebGL apenas no cliente
    if (typeof window === "undefined") return
    
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setIsWebGLSupported(false)
      }
    } catch (e) {
      setIsWebGLSupported(false)
    }
  }, [])

  if (!isWebGLSupported) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 text-sm">WebGL não suportado</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className} style={{ touchAction: 'auto', cursor: 'grab' }} data-three-canvas>
      <Canvas
        dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1}
        frameloop="always"
        camera={{
          position: [0, 0, 5],
          fov: 35,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        onCreated={() => setIsLoaded(true)}
      >
        <Lighting />
        <InteractiveLogo />
      </Canvas>
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Carregando...</p>
          </div>
        </div>
      )}
    </div>
  )
}

