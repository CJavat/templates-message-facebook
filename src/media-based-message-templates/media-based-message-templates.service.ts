import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { CouponTemplateData, TemplateData } from './interfaces';

interface NumbersSent {
  numbers: string;
  status: string;
}

@Injectable()
export class MediaBasedMessageTemplatesService {
  constructor(private readonly configService: ConfigService) {}

  async handleSendSimpleTemplate(templateData: TemplateData) {
    const { imageUrl, languageCode, phoneNumbers, templateName } = templateData;
    let failedNumbers: NumbersSent[] = [];
    let acceptedNumbers: NumbersSent[] = [];

    const token = this.configService.get('WHATSAPP_API_TOKEN');
    const url = this.configService.get('WHATSAPP_API_URL');

    
    await Promise.all(
      phoneNumbers.map(async (phoneNumber) => {
        phoneNumber.includes("+") ? phoneNumber = phoneNumber.replace("+", "") : phoneNumber;
        phoneNumber.includes(",") ? phoneNumber = phoneNumber.replace(",", "") : phoneNumber;
        phoneNumber.includes("\n") ? phoneNumber = phoneNumber.replace("\n", "") : phoneNumber;

        const template = `
      {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": "${phoneNumber.trim()}",
        "type": "template",
        "template": {
          "name": "${templateName}",
          "language": {
            "code": "${languageCode}"
          },
          "components": [
            {
              "type": "header",
              "parameters": [
                {
                  "type": "image",
                  "image": {
                    "link": "${imageUrl}"
                  }
                }
              ]
            },
            {
              "type": "body",
              "parameters": []
            }
          ]
        }
      }
      `;

        try {
          const { data } = await axios.post(url, template, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          acceptedNumbers.push({numbers: data?.contacts[0]?.input ?? 'Numero Desconocdo', status: data?.messages[0]?.message_status})
        } catch (error) {
          failedNumbers.push({numbers: phoneNumber, status: "error"})
          
          console.error(`El número que no se envió fue |- ${phoneNumber} -|`)
          console.error(JSON.stringify(error.message, null, 4));
          console.error(
            `No se pudo enviar la plantilla, ocurrió un error: ${error.message}`,
          );
        }
      })
    );

    console.log({acceptedNumbers, failedNumbers})

    return {acceptedNumbers, failedNumbers};
  }

  async handleSendCouponTemplate(couponTemplateData: CouponTemplateData) {
    const { imageUrl, languageCode, phoneNumbers, templateName, couponCode } = couponTemplateData;
    let failedNumbers: NumbersSent[] = [];
    let acceptedNumbers: NumbersSent[] = [];

    const token = this.configService.get('WHATSAPP_API_TOKEN');
    const url = this.configService.get('WHATSAPP_API_URL');

    await Promise.all(
      phoneNumbers.map(async (phoneNumber) => {
        try {
          phoneNumber.includes("+") ? phoneNumber = phoneNumber.replace("+", "") : phoneNumber;
          phoneNumber.includes(",") ? phoneNumber = phoneNumber.replace(",", "") : phoneNumber;
          phoneNumber.includes("\n") ? phoneNumber = phoneNumber.replace("\n", "") : phoneNumber;

          const template = `
            {
              "messaging_product": "whatsapp",
              "recipient_type": "individual",
              "to": "${phoneNumber.trim()}",
              "type": "template",
              "template": {
                "name": "${templateName}",
                "language": {
                  "code": "${languageCode}"
                },
                "components": [
                  {
                    "type": "header",
                    "parameters": [
                      {
                        "type": "image",
                        "image": {
                          "link": "${imageUrl}"
                        }
                      }
                    ]
                  },
                  {
                    "type": "body",
                    "parameters": []
                  },
                  {
                    "type": "button",
                    "sub_type": "copy_code",
                    "index": "0",
                    "parameters": [
                      {
                        "type": "coupon_code",
                        "coupon_code": "${couponCode}"
                      }
                    ]
                  }
                ]
              }
            }
          `;

          const { data } = await axios.post(url, template, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          acceptedNumbers.push({numbers: data?.contacts[0]?.input ?? 'Numero Desconocdo', status: data?.messages[0]?.message_status})
        } catch (error) {
          failedNumbers.push({numbers: phoneNumber, status: "error"})
          
          console.error(`El número que no se envió fue |- ${phoneNumber} -|`)
          console.error(JSON.stringify(error.message, null, 4));
          console.error(
            `No se pudo enviar la plantilla, ocurrió un error: ${error.message}`,
          );
        }
      })
    );

    console.log({acceptedNumbers, failedNumbers})

    return {acceptedNumbers, failedNumbers};
  }
}