/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 scene.gltf 
Author: Vinny Passmore (https://sketchfab.com/HPrendering)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/barbers-pole-e5eb506d8d5c4cd5a775028a4a3e1d58
Title: Barbers Pole
*/

import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function Barber(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('../../public/model/Barber/scene.gltf')
  const { actions } = useAnimations(animations, group)
  useEffect(() => {
    // if(previousAction){
    //   actions[previousAction].stop()
    // }
    // if(action==='Take 001'){
    //   actions["Take 001"].play();
    // }else{
    //   actions["Take 001"].stop()
    // }
    // actions.Inner|InnerAction.play();

    actions["Inner|InnerAction"].play();
   
    // actions[action].play()
  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="d5ca90980b924f39bdf8682f672d2707fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Inner" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="Inner_Inner_Mat_0" geometry={nodes.Inner_Inner_Mat_0.geometry} material={materials.Inner_Mat} />
                </group>
                <group name="Ouiter" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="Ouiter_Metal12_0" geometry={nodes.Ouiter_Metal12_0.geometry} material={materials.Metal12} />
                  <mesh name="Ouiter_Easy_Glass_0" geometry={nodes.Ouiter_Easy_Glass_0.geometry} material={materials.Easy_Glass} />
                  <mesh name="Ouiter_Light_Top_0" geometry={nodes.Ouiter_Light_Top_0.geometry} material={materials.Light_Top} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('../../public/model/Barber/scene.gltf')
