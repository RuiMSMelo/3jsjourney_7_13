import { OrbitControls } from '@react-three/drei'
import {
    BallCollider,
    CuboidCollider,
    RigidBody,
    Physics,
} from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'

export default function Experience() {
    const cubeRef = useRef()

    const cubeJump = () => {
        // console.log(cubeRef.current)

        cubeRef.current.applyImpulse({ x: 0, y: 5, z: 0 })
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - 0.5,
            y: Math.random() - 0.5,
            z: Math.random() - 0.5,
        })
    }

    return (
        <>
            <Perf position='top-left' />

            <OrbitControls makeDefault />

            <directionalLight castShadow position={[1, 2, 3]} intensity={4.5} />
            <ambientLight intensity={1.5} />

            <Physics debug gravity={[0, -1.6, 0]}>
                <RigidBody colliders='ball' position={[-1.5, 2, 0]}>
                    <mesh castShadow>
                        <sphereGeometry />
                        <meshStandardMaterial color='orange' />
                    </mesh>
                </RigidBody>

                <RigidBody ref={cubeRef} position={[1.5, 2, 0]}>
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
            </Physics>
        </>
    )
}
