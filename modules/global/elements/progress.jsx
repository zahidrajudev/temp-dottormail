import { useEffect, useState } from "react";

function LoaderProgress({ BG = 'bg-gray-300', PROGRESS_COLOR = 'bg-violet-600', HEIGHT = 'h-2.5', SHOW_PERCENTAGE = false }) {
    const [width, setWidth] = useState(0);
    const [count, setCount] = useState(1);
    const [number, setNumber] = useState(0.2);

    const handleAutoProgress = () => {
        if (width >= 100) {
            setWidth(number);
            setTimeout(() => {
                setCount(prev => prev + 1);
            }, 20);
        } else {
            if (width + number > 100) {
                setWidth(number);
            } else {
                setWidth(prev => prev + number);
            }
            setTimeout(() => {
                setCount(prev => prev + 1);
            }, 20);
        }
    }

    useEffect(() => {
        handleAutoProgress();
    }, [count])
    return (
        <div className={`${BG} ${HEIGHT} rounded-full w-full shdaow-3`}>
            <div className={`${PROGRESS_COLOR} h-full rounded-full`} style={{ width: `${width}%` }}></div>
            {/* {SHOW_PERCENTAGE &&
                <div className="flex justify-center text-xs">{Math.round(width)}%</div>
            } */}
        </div>
    );
}

export default LoaderProgress;