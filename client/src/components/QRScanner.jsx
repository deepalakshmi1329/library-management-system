import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScan }) {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: 250 },
            false
        );

        scanner.render(
            decodedText => {
                onScan(decodedText);
                scanner.clear();
            },
            () => {}
        );

        return () => {
            scanner.clear().catch(() => {});
        };
    }, [onScan]);

    return <div id="qr-reader"></div>;
}

export default QRScanner;