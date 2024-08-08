export class Messages {
    messageText: String
    senderId: String
    recieverId: String
    sentAt: String
    isSeen: Boolean
    constructor(
        messageText: String,
        senderId: String,
        recieverId: String,
        sentAt: String,
        isSeen: Boolean
    )
    {
        this.messageText = messageText;
        this.senderId = senderId;
        this.recieverId = recieverId;
        this.sentAt = sentAt;
        this.isSeen = isSeen;

    }

}