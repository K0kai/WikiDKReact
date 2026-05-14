import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL

function AppLoader({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const [isWakingUp, setIsWakingUp] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        const checkServer = async () => {
            try {
                const res = await fetch(`${API_URL}/general/health`);

                if (res.ok) {
                    setIsReady(true);
                    clearInterval(interval);
                }
            } catch {
                // ignore errors, keep retrying
            }
        };

        // show message after a delay
        const timer = setTimeout(() => {
            setIsWakingUp(true);
        }, 3000);

        // retry every 3s
        interval = setInterval(checkServer, 3000);

        checkServer();

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    if (!isReady) {
        return (
            <div className="th-loader flex column">
                <img src="https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/ring-resize-white-36.svg"/>
                {!isWakingUp ? (
                    <p>Carregando...</p>
                ) : (
                    <p>Servidor iniciando... isso pode levar até 1 minuto</p>
                )}
            </div>
        );
    }

    return <>{children}</>;
}

export default AppLoader;