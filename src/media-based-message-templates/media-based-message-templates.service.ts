import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { TemplateData } from './interfaces';

@Injectable()
export class MediaBasedMessageTemplatesService {
  constructor(private readonly configService: ConfigService) {}

  async handleSendTemplate(templateData: TemplateData) {
    const { imageUrl, languageCode, phoneNumbers, templateName } = templateData;

    const token = this.configService.get('WHATSAPP_API_TOKEN');
    const url = this.configService.get('WHATSAPP_API_URL');

    phoneNumbers.forEach(async (phoneNumber) => {
      let template = `
    {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "${phoneNumber}",
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
        console.log(error);

        throw new Error(
          `No se pudo enviar la plantilla, ocurrió un error: ${error.message}`,
        );
      }
    });

    return 'Plantilla enviada correctamente';
  }
}
