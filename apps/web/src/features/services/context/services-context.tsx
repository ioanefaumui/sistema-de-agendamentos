"use client";

import React, { createContext, useState } from "react";
import { Service } from "../types";

interface IServicesContext {
  service: Service;
  time: string;
  date: string;
  setService: React.Dispatch<React.SetStateAction<Service>>;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

interface ServicesContextProviderProps {
  children: React.ReactNode;
}

export const ServicesContext = createContext({} as IServicesContext);

export function ServicesContextProvider({
  children,
}: ServicesContextProviderProps) {
  const [service, setService] = useState<Service>({} as Service);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  const value: IServicesContext = {
    service,
    date,
    time,
    setDate,
    setService,
    setTime,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}
