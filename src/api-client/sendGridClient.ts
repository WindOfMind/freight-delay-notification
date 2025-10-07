import sgMail from "@sendgrid/mail";

export class SendGridClient {
    private client;
    private senderEmail: string;

    constructor(apiKey: string, senderEmail: string) {
        sgMail.setApiKey(apiKey);
        this.client = sgMail;
        this.senderEmail = senderEmail;
    }

    public async sendEmail({
        to,
        subject,
        text,
    }: {
        to: string;
        subject: string;
        text: string;
    }): Promise<void> {
        const msg = {
            to,
            from: this.senderEmail,
            subject,
            text,
        };

        await this.client.send(msg);
    }
}
