"use client";

import { Button } from "@/components";
import { useAuth } from "@/context";
import { CreateServiceDialog } from "@/features/services";
import { useState } from "react";

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { role } = useAuth();

  return (
    <>
      <CreateServiceDialog open={isModalOpen} onOpenChange={setIsModalOpen} />

      <div className="flex items-center justify-between">
        <h1 className="my-4 text-2xl font-semibold tracking-tight">
          {role === "admin" && "Serviços criados"}
          {role === "user" && "Serviços disponíveis"}
        </h1>

        {role === "admin" && (
          <Button onClick={() => setIsModalOpen(true)}>Criar serviço</Button>
        )}
      </div>
    </>
  );
}
