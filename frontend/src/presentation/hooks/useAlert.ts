import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ReactSwal = withReactContent(Swal);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

export function useAlert() {
  const success = (message: string) => {
    Toast.fire({ icon: 'success', title: message });
  };

  const error = (message: string) => {
    Swal.fire({ icon: 'error', title: 'Error', text: message });
  };

  const warning = (message: string) => {
    Swal.fire({ icon: 'warning', title: 'Atención', text: message });
  };

  const confirm = async (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const result = await Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: options.confirmButtonText ?? 'Sí',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
    });
    return result.isConfirmed;
  };

  const confirmDanger = async (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
  }) => {
    const result = await ReactSwal.fire({
      title: options.title,
      text: options.text,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: options.confirmButtonText ?? 'Sí',
      cancelButtonText: options.cancelButtonText ?? 'Cancelar',
    });
    return result.isConfirmed;
  };

  return { success, error, warning, confirm, confirmDanger };
}
