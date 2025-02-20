import { Button } from "@/components";
import { Appointment, AppointmentList } from "@/features/appointments";
import { serverApi, serverApiClient } from "@/lib";
import Link from "next/link";

interface AgendamentosSearchParams {
  page: string;
  limit: string;
}

export default async function Agendamentos({
  searchParams,
}: {
  searchParams: Promise<AgendamentosSearchParams>;
}) {
  const { page, limit } = await searchParams;
  const requestUrl = new URL(`${serverApi}/appointments?page=1&limit=10`);
  if (page) {
    requestUrl.searchParams.set("page", page);
  }
  if (limit) {
    requestUrl.searchParams.set("limit", limit);
  }

  const res = await serverApiClient(requestUrl.toString());
  const appointments: Appointment[] = await res.json();

  return (
    <main className="flex flex-col grow w-full">
      <div className="flex flex-col grow w-[min(100%-2rem,78.5rem)] mx-auto">
        <h1 className="my-4 text-2xl font-semibold tracking-tight">
          Meus agendamentos
        </h1>

        <AppointmentList appointments={appointments} />

        <div className="flex items-end justify-between py-4 mt-auto">
          <p className="text-sm">
            <span className="text-muted-foreground">Página:</span> {page || 1}
          </p>
          <div className="flex gap-x-2">
            <Button
              variant="secondary"
              disabled={Number(page || 0) - 1 <= 0}
              className="relative cursor-pointer"
            >
              Anterior
              <Link
                className="absolute inset-0"
                href={{
                  pathname: "/agendamentos",
                  query: { page: Number(page || 1) - 1 },
                }}
              />
            </Button>
            <Button variant="secondary" className="relative cursor-pointer">
              Próx.
              <Link
                className="absolute inset-0"
                href={{
                  pathname: "/agendamentos",
                  query: {
                    page: Number(page || 1) + 1,
                  },
                }}
              />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
