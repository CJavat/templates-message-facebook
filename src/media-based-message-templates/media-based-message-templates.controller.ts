import { Body, Controller, Post } from '@nestjs/common';
import { MediaBasedMessageTemplatesService } from './media-based-message-templates.service';
import { CouponTemplateData, TemplateData } from './interfaces';

@Controller('media-based-message-templates')
export class MediaBasedMessageTemplatesController {
  constructor(
    private readonly mediaBasedMessageTemplatesService: MediaBasedMessageTemplatesService,
  ) {}

  @Post('send-simple-template')
  sendSimpleTemplate(@Body() body: TemplateData) {
    return this.mediaBasedMessageTemplatesService.handleSendSimpleTemplate(body);
  }

  @Post('send-coupon-template')
  sendCouponTemplate(@Body() body: CouponTemplateData) {
    return this.mediaBasedMessageTemplatesService.handleSendCouponTemplate(body);
  }
}
