import { Body, Controller, Post } from '@nestjs/common';
import { MediaBasedMessageTemplatesService } from './media-based-message-templates.service';
import { TemplateData } from './interfaces';

@Controller('media-based-message-templates')
export class MediaBasedMessageTemplatesController {
  constructor(
    private readonly mediaBasedMessageTemplatesService: MediaBasedMessageTemplatesService,
  ) {}

  @Post('send-template')
  sendTemplate(@Body() body: TemplateData) {
    return this.mediaBasedMessageTemplatesService.handleSendTemplate(body);
  }
}
