import { toast } from 'react-hot-toast';

const commonStyle = {
  border: '1px solid #fff',
  background: '#404040',
  color: '#fff',
};

const commonIconTheme = {
  primary: '#fff',
  secondary: '#000',
};

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    style: commonStyle,
    iconTheme: commonIconTheme,
  });

export const showErrorToast = (message: string) =>
  toast.error(message, {
    style: commonStyle,
    iconTheme: commonIconTheme,
  });