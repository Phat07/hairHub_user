import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { MeshStandardMaterial } from 'three'
import * as THREE from 'three'
function createGradientTexture() {
  // Create a canvas
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  // Get the context
  const context = canvas.getContext('2d')

  // Create a gradient
  
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, 'rgb(255, 241, 165)')
  gradient.addColorStop(0.5, 'rgb(200, 125, 76)')
  gradient.addColorStop(1, 'rgb(83, 54, 54)')

  // Fill the canvas with the gradient
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  // Create a texture from the canvas
  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return texture
}
export default function Cut(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('../../public/model/Cut/scene.gltf')
  const { actions } = useAnimations(animations, group)

  // Define new materials with desired colors
  const gradientTexture = createGradientTexture()
  const bladeMaterial = new THREE.MeshStandardMaterial({ map: gradientTexture })
  const handleMaterial = new MeshStandardMaterial({ color: 'black' })
  const paddingMaterial = new MeshStandardMaterial({ color: 'red' })
  const screwMaterial = new MeshStandardMaterial({ color: 'gray' })

  useEffect(() => {
    actions["Animation"].play()
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="root">
            <group name="GLTF_SceneRootNode" rotation={[Math.PI / 2, 0, 0]}>
              <group name="BladeA_2" position={[0, 0.025, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
                <group name="Handle_0" position={[1.689, 0.05, 1.511]} rotation={[0, -0.607, -Math.PI / 2]} scale={[0.056, 1, 0.085]}>
                  <mesh name="Object_6" geometry={nodes.Object_6.geometry} material={handleMaterial} />
                </group>
                <group name="PaddingA_1">
                  <mesh name="Object_8" geometry={nodes.Object_8.geometry} material={paddingMaterial} />
                </group>
                <mesh name="Object_4" geometry={nodes.Object_4.geometry} material={bladeMaterial} />
              </group>
              <group name="BladeB_5" position={[0, 0.025, -0.025]} rotation={[-Math.PI / 2, -1.214, 0]} scale={-1}>
                <group name="damper_3" position={[1.027, 0.05, 1.334]} rotation={[0, 0.795, Math.PI / 2]} scale={[-0.031, 0.177, 0.074]}>
                  <mesh name="Object_12" geometry={nodes.Object_12.geometry} material={bladeMaterial} />
                </group>
                <group name="PaddingB_4">
                  <mesh name="Object_14" geometry={nodes.Object_14.geometry} material={paddingMaterial} />
                </group>
                <mesh name="Object_10" geometry={nodes.Object_10.geometry} material={bladeMaterial} />
              </group>
              <group name="Screw_6" position={[0, 0.025, 0.05]} rotation={[Math.PI / 2, 0, 0]} scale={[0.1, 0.079, 0.1]}>
                <mesh name="Object_16" geometry={nodes.Object_16.geometry} material={screwMaterial} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('../../public/model/Cut/scene.gltf')
