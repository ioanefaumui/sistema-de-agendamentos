import { Button } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context";
import { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";

interface ServiceDetailDropdownProps
  extends React.ComponentProps<
    React.ForwardRefExoticComponent<
      DropdownMenuItemProps & React.RefAttributes<HTMLDivElement>
    >
  > {
  setAlertModal: (val: boolean) => void;
  setModalIsOpen: (val: boolean) => void;
}

export function ServiceDetailDropdown({
  setAlertModal,
  setModalIsOpen,
  ...props
}: ServiceDetailDropdownProps) {
  const { role } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {role === "user" && (
          <DropdownMenuItem {...props} onClick={() => setModalIsOpen(true)}>
            Ver disponibilidade
          </DropdownMenuItem>
        )}

        {role === "admin" && (
          <DropdownMenuItem {...props} onClick={() => setAlertModal(true)}>
            Remover
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
