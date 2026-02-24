import React from "react";
import { useNavigate } from "react-router-dom";

// Componentes
import DashboardHeader from "../components/ui/dashboard/DashboardHeader";
import DashboardFeatureRow from "../components/ui/dashboard/DashboardFeatureRow";
import FaqSection from "../components/ui/dashboard/FaqSection";

// Estilos
import "../styles/pages/Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  // --- DATOS ---
  const faqData = [
    {
      q: "¿Qué registros puedo usar?",
      a: "Puedes usar todos los registros estándar ($s0-$s7, $t0-$t9, etc.). Recuerda seguir las convenciones de llamada si usas funciones.",
    },
    {
      q: "¿Cómo funciona el evaluador?",
      a: "El sistema inyecta tu código en un entorno de simulación, ejecuta casos de prueba automáticos y valida los resultados finales en los registros de salida esperados.",
    },
    {
      q: "¿Puedo usar Syscalls?",
      a: "Sí, el entorno soporta las syscalls estándar de MARS/SPIM para entrada y salida de datos.",
    },
    {
      q: "¿Qué ocurre si mi código tiene un bucle infinito?",
      a: "El evaluador tiene un sistema de 'timeout' de seguridad. Si el código excede el tiempo límite, se detendrá y marcará como error.",
    },
    {
      q: "¿Cómo descargo mi código?",
      a: "Dentro del IDE, tras seleccionar un ejercicio, aparecerá el botón 'DOWNLOAD .S' para guardar tu trabajo localmente.",
    },
  ];

  return (
    <div className="dashboard-wrapper fade-in-up">
      
      <DashboardHeader />

      <div className="workflow-zigzag">
        
        {/* FILA 1: EVALUADOR (Botón Izquierda) */}
        <DashboardFeatureRow 
          title="Evaluador"
          icon="🧪"
          label="VALIDAR LÓGICA"
          guideTitle="Flujo del Evaluador de Pruebas"
          onNavigate={() => navigate("/evaluator")} // Ajusta la ruta según tu App.jsx
          reverse={false}
          guideItems={[
            { strong: "Carga masiva", text: <span>Sube tus archivos <code>.s</code> directamente al servidor.</span> },
            { strong: "Suite de Tests", text: "Ejecución automática contra múltiples vectores de prueba." },
            { strong: "Feedback Detallado", text: "Visualiza logs de ejecución y valores de registros fallidos." }
          ]}
        />

        {/* FILA 2: IDE (Botón Derecha - Reverse) */}
        <DashboardFeatureRow 
          title="Web IDE"
          icon="💻"
          label="ESCRIBIR CÓDIGO"
          guideTitle="Flujo del Entorno de Desarrollo (IDE)"
          onNavigate={() => navigate("/ide")} // Ajusta la ruta según tu App.jsx
          reverse={true}
          guideItems={[
            { strong: "Editor Inteligente", text: "Resaltado de sintaxis MIPS nativo y autoguardado." },
            { strong: "Inyección Automática", text: <span>No te preocupes por etiquetas <code>main</code>, el sistema las añade.</span> },
            { strong: "Vista Previa", text: "Comprueba cómo se verá tu código final antes de descargarlo." }
          ]}
        />

      </div>

      <FaqSection items={faqData} />

    </div>
  );
};

export default DashboardPage;