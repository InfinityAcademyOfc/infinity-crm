
import { ToastActionElement, ToastProps } from "@/components/ui/toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ToasterToastProps = ToastProps & {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
};

interface ToasterStore {
  toasts: ToasterToastProps[];
  addToast: (toast: ToasterToastProps) => void;
  dismissToast: (id: string) => void;
}

export const toasterStore = create<ToasterStore>()(
  persist(
    (set) => ({
      toasts: [],
      addToast: (toast: ToasterToastProps) => 
        set((state) => ({ toasts: [...state.toasts, toast] })),
      dismissToast: (id: string) => 
        set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
    }),
    {
      name: "toast-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useToast = () => {
  const { toasts, addToast, dismissToast } = toasterStore();

  const toast = (props: Omit<ToasterToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    addToast({ ...props, id });
    return id;
  };

  return {
    toast,
    dismiss: dismissToast,
    toasts,
  };
};

export { toast } from 'sonner';
