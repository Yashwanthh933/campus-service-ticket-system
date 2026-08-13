import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const LoginBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* THREE SCENE SETUP */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      4000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    /* CONSTELLATION PARTICLES SETUP */
    const maxParticleCount = 120;
    const r = 800;
    const rHalf = r / 2;
    const minDistance = 150;

    const particlesData: Array<{ velocity: THREE.Vector3; numConnections: number }> = [];
    const positions = new Float32Array(maxParticleCount * 3);
    const colors = new Float32Array(maxParticleCount * 3);

    const pGeometry = new THREE.BufferGeometry();

    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r - rHalf;
      const y = Math.random() * r - rHalf;
      const z = Math.random() * r - rHalf;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color scheme: Indigo/Cyan
      const mix = Math.random();
      colors[i * 3] = mix * 0.3 + 0.1; // R
      colors[i * 3 + 1] = mix * 0.5 + 0.3; // G
      colors[i * 3 + 2] = 0.9; // B

      particlesData.push({
        velocity: new THREE.Vector3(
          (-1 + Math.random() * 2) * 0.8,
          (-1 + Math.random() * 2) * 0.8,
          (-1 + Math.random() * 2) * 0.8
        ),
        numConnections: 0,
      });
    }

    pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMaterial = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.85,
    });

    const pointCloud = new THREE.Points(pGeometry, pMaterial);
    scene.add(pointCloud);

    /* LINES SETUP */
    const maxConnections = 400;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineColors = new Float32Array(maxConnections * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      linewidth: 1,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    /* MOUSE INTERACTION */
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    /* RENDER LOOP */
    let animationFrameId: number;
    const render = () => {
      animationFrameId = requestAnimationFrame(render);

      // Rotate group slowly
      const time = Date.now() * 0.001;
      pointCloud.rotation.y = time * 0.05;
      lineSegments.rotation.y = time * 0.05;

      let vertexpos = 0;
      let colorpos = 0;

      for (let i = 0; i < maxParticleCount; i++) {
        // update particle position
        positions[i * 3] += particlesData[i].velocity.x;
        positions[i * 3 + 1] += particlesData[i].velocity.y;
        positions[i * 3 + 2] += particlesData[i].velocity.z;

        // boundary check
        if (positions[i * 3] < -rHalf || positions[i * 3] > rHalf) {
          particlesData[i].velocity.x = -particlesData[i].velocity.x;
        }
        if (positions[i * 3 + 1] < -rHalf || positions[i * 3 + 1] > rHalf) {
          particlesData[i].velocity.y = -particlesData[i].velocity.y;
        }
        if (positions[i * 3 + 2] < -rHalf || positions[i * 3 + 2] > rHalf) {
          particlesData[i].velocity.z = -particlesData[i].velocity.z;
        }
      }

      // Check connections
      for (let i = 0; i < maxParticleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < maxParticleCount; j++) {
          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < minDistance && vertexpos < maxConnections * 2 * 3) {
            const alpha = 1.0 - dist / minDistance;

            linePositions[vertexpos++] = x1;
            linePositions[vertexpos++] = y1;
            linePositions[vertexpos++] = z1;

            linePositions[vertexpos++] = x2;
            linePositions[vertexpos++] = y2;
            linePositions[vertexpos++] = z2;

            // Fading lines
            lineColors[colorpos++] = 0.2 * alpha;
            lineColors[colorpos++] = 0.4 * alpha;
            lineColors[colorpos++] = 0.8 * alpha;

            lineColors[colorpos++] = 0.2 * alpha;
            lineColors[colorpos++] = 0.4 * alpha;
            lineColors[colorpos++] = 0.8 * alpha;
          }
        }
      }

      pGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.color.needsUpdate = true;

      // Draw lines count update
      lineGeometry.setDrawRange(0, vertexpos / 3);

      // Smooth camera parallax
      camera.position.x += (mouseX * 250 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 250 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    render();

    /* RESIZE LISTENER */
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    /* CLEANUP */
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      pGeometry.dispose();
      pMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default LoginBackground3D;
