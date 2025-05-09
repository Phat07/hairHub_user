/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 scene.gltf 
Author: bestgamekits (https://sketchfab.com/bestgamekits)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/12-animated-butterflies-8ca3b9aa82694e6b8bc53a69b4529539
Title: 12 Animated butterflies
*/

import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

let a='Take 001'
export default  function ButterFlies(props) {
  const { action } = props;
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('../../public/model/butterflies/scene.gltf')
  const { actions } = useAnimations(animations, group)
  const previousAction = usePrevious(action);
  useEffect(() => {
    // if(previousAction){
    //   actions[previousAction].stop()
    // }
    if(action==='Take 001'){
      actions["Take 001"].play();
    }else{
      actions["Take 001"].stop()
    }
   
    // actions[action].play()
  }, [action,actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.001}>
          <group name="a9eb06653d904b9ca3e3dc842d491c7dfbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="group1" scale={6.476}>
                  <group name="Flower">
                    <mesh name="Flower_PinkFlower_0" geometry={nodes.Flower_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Fern01Alpha">
                    <mesh name="Fern01Alpha_Fern_Alfa_0" geometry={nodes.Fern01Alpha_Fern_Alfa_0.geometry} material={materials.Fern_Alfa} />
                  </group>
                  <group name="Fern02">
                    <mesh name="Fern02_Fern_D_0" geometry={nodes.Fern02_Fern_D_0.geometry} material={materials.Fern_D} />
                  </group>
                  <group name="Flower1">
                    <mesh name="Flower1_PinkFlower_0" geometry={nodes.Flower1_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower2">
                    <mesh name="Flower2_PinkFlower_0" geometry={nodes.Flower2_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower3">
                    <mesh name="Flower3_PinkFlower_0" geometry={nodes.Flower3_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower4">
                    <mesh name="Flower4_PinkFlower_0" geometry={nodes.Flower4_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower5">
                    <mesh name="Flower5_PinkFlower_0" geometry={nodes.Flower5_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower6">
                    <mesh name="Flower6_PinkFlower_0" geometry={nodes.Flower6_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower7">
                    <mesh name="Flower7_PinkFlower_0" geometry={nodes.Flower7_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower8">
                    <mesh name="Flower8_PinkFlower_0" geometry={nodes.Flower8_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower9">
                    <mesh name="Flower9_PinkFlower_0" geometry={nodes.Flower9_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="Flower10">
                    <mesh name="Flower10_PinkFlower_0" geometry={nodes.Flower10_PinkFlower_0.geometry} material={materials.PinkFlower} />
                  </group>
                  <group name="pPlane1">
                    <mesh name="pPlane1_Ground_0" geometry={nodes.pPlane1_Ground_0.geometry} material={materials.Ground} />
                  </group>
                </group>
                <group name="group2">
                  <group name="Object_34">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_84" />
                    <group name="Object_86" />
                    <group name="Object_88" />
                    <group name="Object_90" />
                    <group name="Object_92" />
                    <group name="Object_94" />
                    <skinnedMesh name="Object_85" geometry={nodes.Object_85.geometry} material={materials.B_6_M} skeleton={nodes.Object_85.skeleton} />
                    <skinnedMesh name="Object_87" geometry={nodes.Object_87.geometry} material={materials.B_6_M} skeleton={nodes.Object_87.skeleton} />
                    <skinnedMesh name="Object_89" geometry={nodes.Object_89.geometry} material={materials.B_6_M} skeleton={nodes.Object_89.skeleton} />
                    <skinnedMesh name="Object_91" geometry={nodes.Object_91.geometry} material={materials.B_6_M} skeleton={nodes.Object_91.skeleton} />
                    <skinnedMesh name="Object_93" geometry={nodes.Object_93.geometry} material={materials.B_6_M} skeleton={nodes.Object_93.skeleton} />
                    <skinnedMesh name="Object_95" geometry={nodes.Object_95.geometry} material={materials.B_6_M} skeleton={nodes.Object_95.skeleton} />
                  </group>
                </group>
                <group name="butterflies_1_1" />
                <group name="butterflies_1_11" />
                <group name="butterflies_1_21" />
                <group name="butterflies_1_31" />
                <group name="butterflies_1_41" />
                <group name="butterflies_1_51" />
                <group name="Butterfly_single_2_" />
                <group name="group3" position={[-201.901, 14.642, 752.442]} rotation={[0, -0.705, 0]}>
                  <group name="Object_104">
                    <primitive object={nodes._rootJoint_1} />
                    <group name="Object_106" />
                    <skinnedMesh name="Object_107" geometry={nodes.Object_107.geometry} material={materials.B_5_M} skeleton={nodes.Object_107.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_3_" />
                <group name="group4" position={[-783.446, 145.175, 647.154]} rotation={[0, 0.85, 0]}>
                  <group name="Object_118">
                    <primitive object={nodes._rootJoint_2} />
                    <group name="Object_120" />
                    <skinnedMesh name="Object_121" geometry={nodes.Object_121.geometry} material={materials.B_12_M} skeleton={nodes.Object_121.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_4_16" />
                <group name="Butterfly_single_5_16" />
                <group name="Butterfly_single_6_8" />
                <group name="Butterfly_single_7_8" />
                <group name="Butterfly_single_8_8" />
                <group name="Butterfly_single_9_8" />
                <group name="group5" position={[130.609, 233.178, 1125.963]} rotation={[0, -1.334, 0]} scale={0.833}>
                  <group name="Object_137">
                    <primitive object={nodes._rootJoint_3} />
                    <group name="Object_139" />
                    <skinnedMesh name="Object_140" geometry={nodes.Object_140.geometry} material={materials.lambert9} skeleton={nodes.Object_140.skeleton} />
                  </group>
                </group>
                <group name="group6" position={[640.141, 274.271, 13.347]} rotation={[0, 0.617, 0]} scale={0.795}>
                  <group name="Object_150">
                    <primitive object={nodes._rootJoint_4} />
                    <group name="Object_152" />
                    <skinnedMesh name="Object_153" geometry={nodes.Object_153.geometry} material={materials.B_3_M} skeleton={nodes.Object_153.skeleton} />
                  </group>
                </group>
                <group name="group7" position={[652.797, 262.217, 455.936]} rotation={[-Math.PI, -1.21, -Math.PI]}>
                  <group name="Object_163">
                    <primitive object={nodes._rootJoint_5} />
                    <group name="Object_165" />
                    <skinnedMesh name="Object_166" geometry={nodes.Object_166.geometry} material={materials.lambert10} skeleton={nodes.Object_166.skeleton} />
                  </group>
                </group>
                <group name="group8" position={[-549.592, 196.269, -543.404]} rotation={[0, 0.475, 0]} scale={0.676}>
                  <group name="Object_176">
                    <primitive object={nodes._rootJoint_6} />
                    <group name="Object_178" />
                    <skinnedMesh name="Object_179" geometry={nodes.Object_179.geometry} material={materials.B_8_M} skeleton={nodes.Object_179.skeleton} />
                  </group>
                </group>
                <group name="group9" position={[277.988, 289.992, -927.525]} rotation={[0, 1.256, 0]} scale={0.743}>
                  <group name="Object_189">
                    <primitive object={nodes._rootJoint_7} />
                    <group name="Object_191" />
                    <skinnedMesh name="Object_192" geometry={nodes.Object_192.geometry} material={materials.B_7_M} skeleton={nodes.Object_192.skeleton} />
                  </group>
                </group>
                <group name="group10" position={[-983.635, 185.123, -110.203]} rotation={[0, -1.517, 0]} scale={0.628}>
                  <group name="Object_202">
                    <primitive object={nodes._rootJoint_8} />
                    <group name="Object_204" />
                    <skinnedMesh name="Object_205" geometry={nodes.Object_205.geometry} material={materials.B_11_M} skeleton={nodes.Object_205.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_10_8" />
                <group name="group11" position={[1191.394, 173.703, -158.156]} scale={0.561}>
                  <group name="Object_216">
                    <primitive object={nodes._rootJoint_9} />
                    <group name="Object_218" />
                    <skinnedMesh name="Object_219" geometry={nodes.Object_219.geometry} material={materials.B_4_M} skeleton={nodes.Object_219.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_11_8" />
                <group name="group12" position={[-20.65, 479.187, -77.302]} rotation={[-Math.PI, -1.517, -Math.PI]} scale={0.604}>
                  <group name="Object_230">
                    <primitive object={nodes._rootJoint_10} />
                    <group name="Object_232" />
                    <skinnedMesh name="Object_233" geometry={nodes.Object_233.geometry} material={materials.lambert15} skeleton={nodes.Object_233.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_13" />
                <group name="group13" position={[-354.789, 276.61, 241.616]} scale={0.658}>
                  <group name="Object_244">
                    <primitive object={nodes._rootJoint_11} />
                    <group name="Object_246" />
                    <skinnedMesh name="Object_247" geometry={nodes.Object_247.geometry} material={materials.B_1_M} skeleton={nodes.Object_247.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_13_8" />
                <group name="group14" position={[323.322, 370.328, -180.392]} scale={0.402}>
                  <group name="Object_258">
                    <primitive object={nodes._rootJoint_12} />
                    <group name="Object_260" />
                    <skinnedMesh name="Object_261" geometry={nodes.Object_261.geometry} material={materials.B_5_M} skeleton={nodes.Object_261.skeleton} />
                  </group>
                </group>
                <group name="Butterfly_single_14_8" />
                <group name="group15" position={[-104.618, 415.222, 50.454]} rotation={[0, -0.664, 0]} scale={0.424}>
                  <group name="Object_272">
                    <primitive object={nodes._rootJoint_13} />
                    <group name="Object_274" />
                    <skinnedMesh name="Object_275" geometry={nodes.Object_275.geometry} material={materials.B_12_M} skeleton={nodes.Object_275.skeleton} />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('../../public/model/butterflies/scene.gltf')
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}