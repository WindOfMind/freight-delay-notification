import OpenAI from "openai";

export class OpenAIClient {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
        });
    }

    public async getChatCompletion(
        delayInSec: number,
        userName: string,
        orderId: string,
        companyName: string = "Freight Company",
        agentName: string = "Customer Service Assistant"
    ): Promise<string> {
        const completion = await this.client.responses.create({
            model: "gpt-4o-mini",
            instructions: `You are a polite customer service assistant in the freight company. There is a delay in the shipment. 
                Please explain the reason for the delay and apologize to the customer. 
                You are provided with the delay time in seconds, user name, orderId, company name and agent name in the JSON format.`,
            input: JSON.stringify({
                delayTime: delayInSec,
                userName,
                orderId,
                companyName,
                agentName,
            }),
        });

        const message = completion.output_text;

        return message;
    }
}
