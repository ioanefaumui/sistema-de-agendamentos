import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Appointment } from "../types";
import { format } from "date-fns";

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  return (
    <div className="rounded-lg border">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data e hora</TableHead>
            <TableHead>Preço</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {appointments.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-muted-foreground dark:text-muted-foreground"
              >
                Nenhum agendamento disponível nesta página
              </TableCell>
            </TableRow>
          )}
          {appointments.length > 0 &&
            appointments.map((a) => (
              <TableRow key={a.id}>
                <TableCell>{a.service.name}</TableCell>
                <TableCell>
                  {format(new Date(a.appointmentTime), "dd/MM/yyyy - HH:mm")}
                </TableCell>
                <TableCell>R$ {a.service.price}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
