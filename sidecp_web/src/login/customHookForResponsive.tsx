import { useState, useEffect } from "react";

export default function useDeviceType() {
  const [device, setDevice] = useState({
    computadora: false,
    telefono: false,
    tablet: false,
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function detectarDispositivo() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Detectar si es móvil o tablet por ancho de pantalla
      const esTelefono = width < 768;
      const esTablet = width >= 768 && width < 1024;
      const esComputadora = width >= 1024;

      setDevice({
        computadora: esComputadora,
        telefono: esTelefono,
        tablet: esTablet,
        width,
        height,
      });
    }

    detectarDispositivo();
    window.addEventListener("resize", detectarDispositivo);
    return () => window.removeEventListener("resize", detectarDispositivo);
  }, []);

  return device;
}
