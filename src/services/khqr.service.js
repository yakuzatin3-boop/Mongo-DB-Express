import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";

function formatField(id, value) {
    const length = value.length.toString().padStart(2, "0");
    return `${id}${length}${value}`;
}

/**
 * 🔥 AUTO KHQR GENERATOR (ORDER-BASED)
 */
export async function generateKHQRFromOrder(order) {
    const transactionId = uuidv4();

    let payload = "";

    // 📌 EMV BASIC FORMAT
    payload += formatField("00", "01");
    payload += formatField("01", "12"); // dynamic QR

    // 🏦 Merchant (YOU)
    payload += formatField("29",
        formatField("00", "KH.BAKONG") +
        formatField("01", "YOUR_MERCHANT_ID")
    );

    // 💰 Currency (KHR)
    payload += formatField("53", "116");

    // 💵 AMOUNT FROM ORDER
    payload += formatField("54", order.totalPrice.toString());

    payload += formatField("58", "KH");
    payload += formatField("59", "My E-Commerce Shop");

    // 📦 ORDER ID LINKED
    payload += formatField("62",
        formatField("05", order._id.toString())
    );

    // 🔐 CRC placeholder (Bakong requires real CRC in production)
    payload += "6304";

    // 🖼️ QR IMAGE
    const qrImage = await QRCode.toDataURL(payload);

    return {
        transactionId,
        payload,
        qrImage
    };
}