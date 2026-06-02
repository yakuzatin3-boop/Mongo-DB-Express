export const newOrderTemplate = (order) => {
    return `
🛒 New Order Received

📦 Order ID: ${order._id}
💰 Total: $${order.totalPrice}
📄 Status: ${order.status}
💳 Payment: ${order.paymentMethod}

🆔 Transaction ID:
${order.transactionId || "Not Generated"}

⏰ ${new Date().toLocaleString()}
`;
};