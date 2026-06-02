import axios from "axios";

export const sendTelegramMessage = async (message) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            throw new Error("Telegram env variables missing");
        }

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML"
        });

        return response.data;

    } catch (error) {
        console.error(
            "Telegram Error:",
            error.response?.data || error.message
        );
    }
};