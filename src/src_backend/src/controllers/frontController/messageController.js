
// export const messageCallback = (req, res) => {
//     console.log("Valid Webhook Call:", req.body);

//     const { event, payload } = req.body;

//     if (event === "message") {
//     console.log(`New Message: ${payload.text} from ${payload.sender}`);
//     } else if (event === "message-delivery") {
//     console.log(`Message delivered to ${payload.recipient}`);
//     } else if (event === "otp-status") {
//     console.log(`OTP Status: ${payload.status} for ${payload.number}`);
//     }

//     res.status(200).json({ success: true, message: "Webhook received" });
// }

export const messageCallback = (req, res) => {
    console.log("Valid Webhook Call:", req.body);

    // const { event, payload } = req.body;
    const { app, timestamp, version, type, payload } = req.body;
    const { id, gsId, type: eventType, destination, payload: eventPayload } = payload;
 
    console.log("App:", app);
    console.log("Timestamp:", new Date(timestamp).toISOString());
    console.log("Version:", version);
    console.log("Event Type:", type);
    console.log("Message ID:", id);
    console.log("Gupshup Message ID:", gsId || "N/A");
    console.log("Status:", eventType);
    console.log("Destination:", destination);
    console.log("Additional Payload:", eventPayload);

    // if (!payload) {
    //     return res.status(400).json({ error: "Invalid payload" });
    // }

    switch (eventType) {
        case "enqueued":
        console.log(`Message to ${destination} has been queued.`);
        break;
        case "failed":
        console.log(`Message to ${destination} failed to send.`);
        if(destination) {
            sendTextessage(destination);
        }
        break;
        case "sent":
        console.log(`Message sent to ${destination}.`);
        break;
        case "delivered":
        console.log(`Message delivered to ${destination}.`);
        break;
        case "read":
        console.log(`Message read by ${destination}.`);
        break;
        case "deleted":
        console.log(`Message to ${destination} was deleted.`);
        break;
        default:
        console.log(`Unknown event type: ${eventType}`);
        }

    res.status(200).json({ success: true, message: "Webhook received" });
}

// app.post("/gupshup-webhook", (req, res) => {

//     console.log("Valid Webhook Call:", req.body);

//     const { event, payload } = req.body;

//     if (event === "message") {
//     console.log(`New Message: ${payload.text} from ${payload.sender}`);
//     } else if (event === "message-delivery") {
//     console.log(`Message delivered to ${payload.recipient}`);
//     } else if (event === "otp-status") {
//     console.log(`OTP Status: ${payload.status} for ${payload.number}`);
//     }

//     res.status(200).json({ success: true, message: "Webhook received" });
// });


const sendTextessage = (destination = null, otp) => {
    try {
        console.log('message text')
        // ### Call text message here.

    }
    catch (error) {
        throw new Error(error);
    }
}