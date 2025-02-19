import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useServices } from "../hooks";
import { ServicesContext } from "../context/services-context";
import { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components";
import { Service } from "../types";

export function CustomAlertDialog({
  ...props
}: React.ComponentProps<React.FC<AlertDialogProps>>) {
  const { service, setService } = useContext(ServicesContext);
  const { deleteService, error } = useServices();

  const handleDeleteService = async () => {
    await deleteService(service.id);
    if (!error && props.onOpenChange) {
      props.onOpenChange(false);
    }
    setService({} as Service);
  };

  const handleCloseModal = () => {
    setService({} as Service);
    if (props.onOpenChange) {
      props.onOpenChange(false);
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tem certeza disso?</DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita. O serviço será removido para
            sempre.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={handleCloseModal}>
            {" "}
            Cancelar
          </Button>
          <Button onClick={handleDeleteService}>Confirmar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
