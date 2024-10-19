import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDModelViewer = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

    // Helper functions
    const createRack = (x, z) => {
      const rackGroup = new THREE.Group();
      const rackGeometry = new THREE.BoxGeometry(1, 2, 0.5);
      const rackMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
      const rack = new THREE.Mesh(rackGeometry, rackMaterial);
      rack.position.set(x, 1, z);
      rackGroup.add(rack);
      
      // Add servers to rack
      for (let i = 0; i < 5; i++) {
        const serverGeometry = new THREE.BoxGeometry(0.9, 0.2, 0.4);
        const serverMaterial = new THREE.MeshPhongMaterial({ color: 0x44aa88 });
        const server = new THREE.Mesh(serverGeometry, serverMaterial);
        server.position.set(0, -0.8 + i * 0.3, 0);
        rackGroup.add(server);
      }
      
      return rackGroup;
    };

    // Add racks to the scene
    for (let i = -8; i <= 8; i += 2) {
      for (let j = -4; j <= 4; j += 2) {
        scene.add(createRack(i, j));
      }
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '400px' }} />;
};

export default ThreeDModelViewer;