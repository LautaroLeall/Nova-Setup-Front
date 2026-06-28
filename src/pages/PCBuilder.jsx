import { BuilderProgress } from "../components/builder/BuilderProgress";
import { BuilderStepViewer } from "../components/builder/BuilderStepViewer";
import { BuilderSummaryBox } from "../components/builder/BuilderSummaryBox";
import "../styles/builder/PCBuilderLayout.css";

export const PCBuilder = () => {
  return (
    // Ya que App.jsx ya tiene el PCBuilderProvider global (si lo configuramos global),
    // no hace falta envolverlo aquí. Pero si decidimos que el estado del Armador 
    // solo debe existir MIENTRAS el usuario está en esta ruta, lo envolvemos aquí.
    // Lo ideal es envolverlo aquí para que al salir se limpie todo automáticamente.
    // NOTA: Como en App.jsx lo pusimos global para que el Header lo vea si quisiéramos, 
    // dejaremos que el global actúe. Ojo: si queremos que se borre al salir, es mejor 
    // manejarlo aquí. Vamos a usar el Context global para permitir que si va a "Tienda" 
    // y vuelve, no pierda su armado.

    <div className="pc-builder-page">
      <div className="builder-header-bg"></div>

      <div className="builder-layout-container">

        {/* Barra de progreso superior */}
        <div className="builder-progress-section">
          <BuilderProgress />
        </div>

        {/* Cuerpo dividido en 2 columnas */}
        <div className="builder-main-content">
          <div className="builder-left-col">
            <BuilderStepViewer />
          </div>

          <div className="builder-right-col">
            <div className="builder-sticky-sidebar">
              <BuilderSummaryBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
