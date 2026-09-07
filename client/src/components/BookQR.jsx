import { useEffect, useState } from "react";
import QRCode from "qrcode";

function BookQR({ bookId }) {
    const [qrCode, setQrCode] = useState("");

    useEffect(() => {
        const generateQR = async () => {
            try {
                const url = await QRCode.toDataURL(bookId);
                setQrCode(url);
            } catch (error) {
                console.error(
                    "QR generation failed",
                    error
                );
            }
        };

        generateQR();
    }, [bookId]);

    if (!qrCode) {
        return <p>Generating QR...</p>;
    }

    return (
        <div>
            <img
                src={qrCode}
                alt={`QR code for ${bookId}`}
                width="150"
            />

            <p>{bookId}</p>
        </div>
    );
}

export default BookQR;