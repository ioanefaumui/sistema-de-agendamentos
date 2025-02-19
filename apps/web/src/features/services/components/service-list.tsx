"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Service } from "../types";
import { ServiceDetailDropdown } from "./service-detail-dropdown";
import { useContext, useState } from "react";
import { ServiceDetailDialog } from "./service-detail-dialog";
import { ServicesContext } from "../context/services-context";
import { currency } from "@/lib/currency";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { CustomAlertDialog } from "./custom-alert-dialog";
dayjs.extend(utc);

interface ServeListProps {
  services: Service[];
}

export function ServiceList({ services }: ServeListProps) {
  const [modaIsOpen, setModalIsOpen] = useState(false);
  const [alertModal, setAlertModal] = useState(false);

  const { setService } = useContext(ServicesContext);

  return (
    <div className="border rounded-lg">
      <ServiceDetailDialog open={modaIsOpen} onOpenChange={setModalIsOpen} />
      <CustomAlertDialog open={alertModal} onOpenChange={setAlertModal} />

      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Horário</TableHead>
            <TableHead className="text-right">Preço</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {services.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground dark:text-muted-foreground"
              >
                Nenhum serviço disponível nesta página
              </TableCell>
            </TableRow>
          )}
          {services.length > 0 &&
            services.map((s) => (
              <TableRow key={s.id} onClick={() => setService(s)}>
                <TableCell>{s.name}</TableCell>
                <TableCell>
                  {dayjs.utc(s.startTime).local().format("HH:mm")} -{" "}
                  {dayjs.utc(s.endTime).local().format("HH:mm")}
                </TableCell>
                <TableCell className="text-right">
                  {currency.format(s.price)}
                </TableCell>
                <TableCell className="text-right">
                  <ServiceDetailDropdown
                    setModalIsOpen={setModalIsOpen}
                    setAlertModal={setAlertModal}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
