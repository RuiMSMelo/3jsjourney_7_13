import { useGLTF, OrbitControls } from '@react-three/drei'
import {
    BallCollider,
    CuboidCollider,
    RigidBody,
    Physics,
    CylinderCollider,
    InstancedRigidBodies,
} from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Experience() {
    const hamburger = useGLTF('./hamburger.glb')

    const [hitSound] = useState(() => new Audio('./hit.mp3'))

    const cubesCount = 200
    const instances = useMemo(() => {
        const instances = []

        for (let i = 0; i < cubesCount; i++) {
            instances.push({
                key: 'instance_' + i,
                position: [
                    (Math.random() - 0.5) * 8,
                    6 + i * 0.2,
                    (Math.random() - 0.5) * 8,
                ],
                rotation: [Math.random(), Math.random(), Math.random()],
            })
        }

        return instances
    }, [])

    // const cubesRef = useRef()

    // useEffect(() => {
    //     for (let i = 0; i < cubesCount; i++) {
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1)
    //         )
    //         cubesRef.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    const cubeRef = useRef()
    const twisterRef = useRef()

    const cubeJump = () => {
        // console.log(cubeRef.current)

        cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5,
        })
    }

    useFrame((state) => {
        if (!twisterRef.current) return //null check

        const time = state.clock.getElapsedTime()
        const eulerRotation = new THREE.Euler(0, time * 3, 0)
        const quaternionRotation = new THREE.Quaternion()
        quaternionRotation.setFromEuler(eulerRotation)
        twisterRef.current.setNextKinematicRotation(quaternionRotation)

        const angle = time * 0.5
        const x = Math.cos(angle) * 2
        const z = Math.sin(angle) * 2
        twisterRef.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z })
    })

    const collisionEnter = () => {
        // hitSound.currentTime = 0
        // hitSound.volume = Math.random()
        // hitSound.play()
    }

    return (
        <>
            <Perf position='top-left' />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug={false} gravity={[0, -9.81, 0]}>
                <RigidBody colliders='ball' position={[-1.5, 2, 0]}>
                    <mesh castShadow>
                        <sphereGeometry />
                        <meshStandardMaterial color='orange' />
                    </mesh>
                </RigidBody>

                <RigidBody
                    ref={cubeRef}
                    position={[1.5, 2, 0]}
                    gravityScale={1}
                    restitution={0.5}
                    friction={0.7}
                    colliders={false}
                    onCollisionEnter={collisionEnter}
                >
                    <CuboidCollider args={[0.5, 0.5, 0.5]} mass={1} />
                    <mesh castShadow onClick={cubeJump}>
                        <boxGeometry />
                        <meshStandardMaterial color='crimson' />
                    </mesh>
                </RigidBody>

                <RigidBody type='fixed'>
                    <mesh receiveShadow position-y={-1.25}>
                        <boxGeometry args={[10, 0.5, 10]} />
                        <meshStandardMaterial color='greenyellow' />
                    </mesh>
                </RigidBody>
                <RigidBody
                    type='kinematicPosition'
                    position={[0, -0.8, 0]}
                    friction={0}
                    ref={twisterRef}
                >
                    <mesh castShadow scale={[0.4, 0.4, 3]}>
                        <boxGeometry />
                        <meshStandardMaterial color='cyan' />
                    </mesh>
                </RigidBody>
                <RigidBody colliders={false} position={[0, 4, 0]}>
                    <primitive object={hamburger.scene} scale={0.25} />
                    <CylinderCollider args={[0.5, 1.25]} />
                </RigidBody>
                <RigidBody type='fixed'>
                    <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
                    <CuboidCollider
                        args={[5, 2, 0.5]}
                        position={[0, 1, -5.5]}
                    />
                    <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
                    <CuboidCollider
                        args={[0.5, 2, 5]}
                        position={[-5.5, 1, 0]}
                    />
                </RigidBody>

                <InstancedRigidBodies instances={instances}>
                    <instancedMesh castShadow args={[null, null, cubesCount]}>
                        <boxGeometry />
                        <meshStandardMaterial color='tomato' />
                    </instancedMesh>
                </InstancedRigidBodies>
            </Physics>
        </>
    )
}
