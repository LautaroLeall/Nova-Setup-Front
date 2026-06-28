import { useContext } from "react";
import { PCBuilderContext } from "../../context/PCBuilderContext";
import { motion } from "framer-motion";
import "../../styles/builder/BuilderProgress.css";
import { Check } from "lucide-react";

export const BuilderProgress = () => {
  const { steps, currentStepIndex, selectedComponents, goToStep } = useContext(PCBuilderContext);

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="builder-progress-container">
      <div className="builder-progress-bar-wrapper">
        <motion.div
          className="builder-progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="builder-steps-list">
        {steps.map((step, idx) => {
          const isCompleted = !!selectedComponents[step.id];
          const isActive = idx === currentStepIndex;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              className={`builder-step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => goToStep(idx)}
              disabled={idx > currentStepIndex + 1 && !isCompleted}
            >
              <div className="step-icon-wrapper">
                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span className="step-label">{step.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
