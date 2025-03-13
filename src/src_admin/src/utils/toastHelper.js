import { useState } from "react";
import { ToastMessage } from "../components/ToastMessage";

export const usePushToastHelper = () => {
    const [toasts, setToasts] = useState(0)

    const pushToastsMessage = ( messageType = null, message = null ) => {

        if (!messageType && !message) return;
    
        const newToast = {
            id: Date.now(),
            component: <ToastMessage key={Date.now()} type={messageType} message={message} />,
        };
        setToasts(() => newToast.component);
    };

    return { toasts, pushToastsMessage }
}