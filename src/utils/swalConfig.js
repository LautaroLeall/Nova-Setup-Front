import Swal from 'sweetalert2';

// Instancia base de SweetAlert2 con estilos "Gamer/Neón" de Nova SetUp
const novaSwal = Swal.mixin({
  background: '#1a1a2e',
  color: '#ffffff',
  confirmButtonColor: '#3adbf1', // Cyan neón
  cancelButtonColor: '#ff2a5f', // Rojo/Magenta neón
  denyButtonColor: '#ff2a5f',
  customClass: {
    popup: 'rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(58,219,241,0.1)]',
    title: 'text-xl font-bold tracking-wide',
    confirmButton: 'text-black font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95',
    cancelButton: 'text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95',
    denyButton: 'text-white font-bold px-6 py-2 rounded-lg transition-transform hover:scale-105 active:scale-95',
  },
  buttonsStyling: true,
});

export const showSuccessAlert = (title, text) => {
  return novaSwal.fire({
    icon: 'success',
    title,
    text,
    iconColor: '#3adbf1'
  });
};

export const showErrorAlert = (title, text) => {
  return novaSwal.fire({
    icon: 'error',
    title,
    text,
    iconColor: '#ff2a5f'
  });
};

export const showInfoAlert = (title, text) => {
  return novaSwal.fire({
    icon: 'info',
    title,
    text,
    iconColor: '#a855f7' // Violeta
  });
};

export const showConfirmDialog = (title, text, confirmText = 'Confirmar', cancelText = 'Cancelar') => {
  return novaSwal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    iconColor: '#facc15'
  });
};

export default novaSwal;
