import sgMail from "@sendgrid/mail";

export class SendGridClient {
    private client;

    constructor(apiKey: string) {
        sgMail.setApiKey(apiKey);
        this.client = sgMail;
    }

    public async sendEmail({
        from,
        to,
        subject,
        text,
    }: {
        from: string;
        to: string;
        subject: string;
        text: string;
    }): Promise<void> {
        const msg = {
            to,
            from,
            subject,
            text,
        };

        await this.client.send(msg);
    }
}
