"use client";

import { useContext } from "react";
import { ServicesContext } from "../context/services-context";
import { useAbortableSWR } from "@/hooks";

interface AvailabilityReponse {
  slots: { start: string; end: string; available: boolean }[];
}

export function useAvailability() {
  const { service, date } = useContext(ServicesContext);

  const {
    data,
    isLoading: isLoadingAvailability,
    mutate,
  } = useAbortableSWR<AvailabilityReponse>(
    service.id && date
      ? `http://localhost:3001/availability?serviceId=${service.id}&date=${date}`
      : null,
    800
  );

  const slots: { start: string; end: string; available: boolean }[] =
    data?.slots || [];

  return { slots, isLoadingAvailability, mutate, data };
}
