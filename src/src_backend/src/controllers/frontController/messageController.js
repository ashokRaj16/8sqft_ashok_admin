

export const messageCallback = (req, res) => {

    const { app, timestamp, version, type, payload } = req.body;
    const { id, gsId, type: eventType, destination, payload: eventPayload } = payload;

    switch (eventType) {
        case "enqueued":
        break;
        case "failed":
        if(destination) {
            sendTextessage(destination);
        }
        break;
        case "sent":
        break;
        case "delivered":
        break;
        case "read":
        break;
        case "deleted":
        break;
        default:
        }

    res.status(200).json({ success: true, message: "Webhook received" });
}
