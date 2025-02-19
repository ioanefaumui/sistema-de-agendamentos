import { Button } from "@/components";
import { ServiceList } from "@/features/services";
import { ServicesContextProvider } from "@/features/services/context/services-context";
import { Service } from "@/features/services/types";
import { api, serverApiClient } from "@/lib";
import Link from "next/link";
import { Header } from "./header";

interface ServicosSearchParams {
  page: string;
  limit: string;
}

export default async function Servicos({
  searchParams,
}: {
  searchParams: Promise<ServicosSearchParams>;
}) {
  const { page, limit } = await searchParams;
  const requestUrl = new URL(`${api}/services?page=1&limit=10`);
  if (page) {
    requestUrl.searchParams.set("page", page);
  }
  if (limit) {
    requestUrl.searchParams.set("limit", limit);
  }
  const res = await serverApiClient(requestUrl.toString());
  const services: Service[] = await res.json();

  return (
    <ServicesContextProvider>
      <main className="flex flex-col grow w-full">
        <div className="flex flex-col grow w-[min(100%-2rem,78.5rem)] mx-auto">
          <Header />

          <ServiceList services={services} />

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
                    pathname: "/servicos",
                    query: { page: Number(page || 1) - 1 },
                  }}
                />
              </Button>
              <Button variant="secondary" className="relative cursor-pointer">
                Próx.
                <Link
                  className="absolute inset-0"
                  href={{
                    pathname: "/servicos",
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
    </ServicesContextProvider>
  );
}
