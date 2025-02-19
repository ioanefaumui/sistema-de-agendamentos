"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { CreateServiceSchema } from "../types";
import {
  convertMinutesToDate,
  convertMinutesToHHMM,
  createServiceSchema,
  handleDurationChange,
  moneyMask,
} from "../utils";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useServices } from "../hooks";
import { CreateServiceDto } from "../dto";

export function CreateServiceDialog({
  ...props
}: React.ComponentProps<React.FC<DialogProps>>) {
  const [serviceInterval, setServiceInterval] = useState([480, 1080]);
  const { createService, loading } = useServices();

  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      duration: "",
      endTime: convertMinutesToDate(serviceInterval[1]).toString(),
      name: "",
      price: "",
      startTime: convertMinutesToDate(serviceInterval[0]).toString(),
    },
  });

  const handleSubmit = (values: CreateServiceSchema) => {
    const sanitized: CreateServiceDto = {
      duration: parseInt(values.duration.trim()),
      endTime: values.endTime,
      name: values.name.trim(),
      price: parseInt(values.price.trim()),
      startTime: values.startTime,
    };

    createService(sanitized);
  };

  return (
    <Dialog {...props}>
      <DialogContent
        onCloseAutoFocus={() => {
          form.reset();
          setServiceInterval([480, 1080]);
        }}
      >
        <DialogHeader>
          <DialogTitle>Criar serviço</DialogTitle>
          <DialogDescription>
            Preencha as informações necessárias
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="w-full" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do serviço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      maxLength={9}
                      placeholder="R$ 50,00"
                      {...field}
                      onChange={(e) => field.onChange(moneyMask(e).toString())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Duração em minutos</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      maxLength={4}
                      placeholder="30 Minutos"
                      {...field}
                      onChange={(e) => handleDurationChange(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <FormLabel className="leading-none">Período disponível</FormLabel>
              <div className="flex items-center justify-between">
                <span>{convertMinutesToHHMM(serviceInterval[0])}</span>
                <span>{convertMinutesToHHMM(serviceInterval[1])}</span>
              </div>
              <Slider
                max={1080}
                min={480}
                step={10}
                className="mt-2"
                value={serviceInterval}
                onValueChange={(v) => setServiceInterval(v)}
                onValueCommit={(v) => {
                  form.setValue(
                    "startTime",
                    convertMinutesToDate(v[0]).toString()
                  );
                  form.setValue(
                    "endTime",
                    convertMinutesToDate(v[1]).toString()
                  );
                }}
              />
            </div>

            <Button className="mt-6 w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Criar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
