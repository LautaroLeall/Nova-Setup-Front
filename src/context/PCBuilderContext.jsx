/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, useCallback } from "react";
import {
  Cpu,
  CircuitBoard,
  Fan,
  MemoryStick,
  MonitorPlay,
  HardDrive,
  Zap,
  Box,
  Monitor,
  Keyboard
} from "lucide-react";

export const PCBuilderContext = createContext();

export const PCBuilderProvider = ({ children }) => {
  const steps = useMemo(() => [
    { id: "procesador", label: "Procesador", categoryFilter: "Procesadores", icon: Cpu, isRequired: true },
    { id: "mother", label: "Motherboard", categoryFilter: "Mothers", icon: CircuitBoard, isRequired: true },
    { id: "cooler", label: "Cooler", categoryFilter: "Coolers", icon: Fan, isRequired: false },
    { id: "ram", label: "Memoria RAM", categoryFilter: "Memorias RAM", icon: MemoryStick, isRequired: true },
    { id: "gpu", label: "Placa de Video", categoryFilter: "Placas de Video", icon: MonitorPlay, isRequired: false },
    { id: "storage", label: "Almacenamiento", categoryFilter: "Almacenamiento", icon: HardDrive, isRequired: true },
    { id: "psu", label: "Fuente", categoryFilter: "Fuentes", icon: Zap, isRequired: true },
    { id: "case", label: "Gabinete", categoryFilter: "Gabinetes", icon: Box, isRequired: true },
    { id: "monitor", label: "Monitor", categoryFilter: "Monitores", icon: Monitor, isRequired: false },
    { id: "peripherals", label: "Periféricos", categoryFilter: "Periféricos", icon: Keyboard, isRequired: false },
  ], []);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState({});

  const totalPrice = useMemo(() => {
    return Object.values(selectedComponents).reduce((acc, product) => {
      if (!product) return acc;
      const priceToUse = product.discountPrice ? product.discountPrice : product.price;
      return acc + priceToUse;
    }, 0);
  }, [selectedComponents]);

  const selectComponent = useCallback((stepId, product) => {
    setSelectedComponents((prev) => ({
      ...prev,
      [stepId]: product
    }));
  }, []);

  const removeComponent = useCallback((stepId) => {
    setSelectedComponents((prev) => {
      const newState = { ...prev };
      delete newState[stepId];
      return newState;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToStep = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  const isConfigurationValid = useCallback(() => {
    return steps.filter(step => step.isRequired).every(step => selectedComponents[step.id]);
  }, [steps, selectedComponents]);

  const clearBuilder = useCallback(() => {
    setSelectedComponents({});
    setCurrentStepIndex(0);
  }, []);

  const value = useMemo(() => ({
    steps,
    currentStepIndex,
    selectedComponents,
    totalPrice,
    selectComponent,
    removeComponent,
    nextStep,
    prevStep,
    goToStep,
    isConfigurationValid,
    clearBuilder
  }), [
    steps, currentStepIndex, selectedComponents, totalPrice,
    selectComponent, removeComponent, nextStep, prevStep,
    goToStep, isConfigurationValid, clearBuilder
  ]);

  return (
    <PCBuilderContext.Provider value={value}>
      {children}
    </PCBuilderContext.Provider>
  );
};
