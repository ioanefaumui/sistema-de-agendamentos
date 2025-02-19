import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogProps } from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import { useContext, useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, Label } from "@/components";
import { ServicesContext } from "../context/services-context";
import { format } from "date-fns";
import { useAvailability } from "../hooks";
import { Service } from "../types";
import { currency } from "@/lib/currency";
import { useAppointments } from "@/features/appointments";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Loader2 } from "lucide-react";
dayjs.extend(utc);

export function ServiceDetailDialog({
  onOpenChange,
  ...props
}: React.ComponentProps<React.FC<DialogProps>>) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const {
    setDate: setContextDate,
    setService,
    service,
    time,
    setTime,
  } = useContext(ServicesContext);
  const { slots, isLoadingAvailability, mutate } = useAvailability();
  const { createAppointment, loading } = useAppointments();

  const today = new Date();

  const handleCreateAppointment = async () => {
    if (!date) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    const appointmentTime = new Date(`${formattedDate}T${time}Z`);
    await createAppointment(service.id, appointmentTime.toString());
    setTime("");
    mutate();
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setTime("");
      setDate(date);
      const formattedDate = format(date, "yyyy-MM-dd");
      setContextDate(formattedDate);
    }
  };

  const handleSelectTime = (time: string) => {
    setTime(time);
  };

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setContextDate(formattedDate);
    }
  }, [date, setContextDate]);

  const handleClose = () => {
    setTime("");
    setService({} as Service);
    setContextDate("");
    if (onOpenChange) {
      onOpenChange(false);
    }
    setDate(today);
  };

  return (
    <Dialog onOpenChange={handleClose} {...props}>
      <DialogContent className="w-fit sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>{service.name}</DialogTitle>
          <DialogDescription>
            Selecione a data desejada para agendamento
          </DialogDescription>
        </DialogHeader>

        <ScrollArea
          className="relative h-[calc(100svh-16rem)] max-h-[35rem]"
          scrollHideDelay={2000}
        >
          <div className="grid sm:grid-cols-[auto_1fr] auto-rows-[auto_1fr] gap-4">
            <div className="sm:sticky top-0 rounded-md border w-fit h-fit">
              <h4 className="p-3 pb-0 text-sm opacity-60">
                Selecione uma data:
              </h4>
              <Calendar
                required
                mode="single"
                selected={date}
                onSelect={handleSelectDate}
                disabled={{ before: today }}
                className=""
              />
            </div>

            <RadioGroup className="w-full sm:min-w-[15.625rem] p-3 rounded-md border accent-transparent">
              <h4 className="text-sm text-muted-foreground">
                {isLoadingAvailability
                  ? "Carregando horários..."
                  : "Selecione um horário:"}
              </h4>
              {slots.map((s, i) => (
                <div
                  onClick={() => handleSelectTime(s.start)}
                  aria-disabled={!s.available}
                  key={`${i}${date}`}
                  className="flex items-center bg-accent hover:bg-primary-foreground dark:bg-muted rounded-sm  hover:dark:bg-primary-foreground
                  aria-disabled:text-destructive text-chart-2 aria-disabled:dark:bg-primary-foreground aria-disabled:opacity-50  aria-disabled:pointer-events-none"
                >
                  <RadioGroupItem
                    disabled={!s.available}
                    value={time ? `${i}` : ""}
                    id={`${i}`}
                    className="relative flex items-center justify-center px-5 h-full border-none before:absolute before:border before:size-4 before:rounded-full shadow-none disabled:before:border-destructive"
                  />
                  <Label htmlFor={i.toString()} className="w-full p-4 pl-0">
                    {dayjs
                      .utc(`${format(date || "", "yyyy-MM-dd")}T${s.start}`)
                      .local()
                      .format("HH:mm")}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </ScrollArea>
        <DialogFooter className="text-center sm:text-left items-center flex-col gap-y-4 sm:flex-row sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              Data: {date && format(date, "dd/MM/yyyy")}
              {time && ` - ${time.substring(0, 5)}`}
            </p>
            <p>
              Preço:{" "}
              <span className="font-bold">
                {currency.format(service.price)}
              </span>{" "}
            </p>
          </div>
          <div className="relative flex flex-col items-end">
            <Button
              className="relative flex items-center min-w-[192.44px] justify-center w-full sm:w-fit"
              disabled={loading || !time}
              onClick={handleCreateAppointment}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirmar agendamento"
              )}
            </Button>
            {!time && (
              <span className="text-xs absolute right-0 text-right whitespace-nowrap bottom-0 translate-y-[100%] text-muted-foreground dark:text-muted-foreground">
                Selecione um horário para continuar
              </span>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
