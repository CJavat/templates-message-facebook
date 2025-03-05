import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { CouponTemplateData, TemplateData } from './interfaces';

@Injectable()
export class MediaBasedMessageTemplatesService {
  constructor(private readonly configService: ConfigService) {}

  async handleSendSimpleTemplate(templateData: TemplateData) {
    const { imageUrl, languageCode, phoneNumbers, templateName } = templateData;

    const token = this.configService.get('WHATSAPP_API_TOKEN');
    const url = this.configService.get('WHATSAPP_API_URL');

    
    phoneNumbers.forEach(async (phoneNumber) => {
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
        console.log(data);

        return data;
      } catch (error) {
        console.log(JSON.stringify(error, null, 4));

        throw new Error(
          `No se pudo enviar la plantilla, ocurrió un error: ${error.message}`,
        );
      }
    });

    return 'Plantilla enviada correctamente';
  }

  async handleSendCouponTemplate(couponTemplateData: CouponTemplateData) {
    const { imageUrl, languageCode, phoneNumbers, templateName, couponCode } = couponTemplateData;

    const token = this.configService.get('WHATSAPP_API_TOKEN');
    const url = this.configService.get('WHATSAPP_API_URL');

    phoneNumbers.forEach(async (phoneNumber) => {
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

      try {
        const { data } = await axios.post(url, template, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(data);

        return data;
      } catch (error) {
        console.log(JSON.stringify(error, null, 4));

        throw new Error(
          `No se pudo enviar la plantilla, ocurrió un error: ${error}`,
        );
      }
    });

    return 'Plantilla enviada correctamente';
  }
}
