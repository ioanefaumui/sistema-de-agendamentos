export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  appointmentTime: string;
  service: {
    name: string;
    price: string;
  };
}
