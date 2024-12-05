import { Module } from '@nestjs/common';
import { MediaBasedMessageTemplatesService } from './media-based-message-templates.service';
import { MediaBasedMessageTemplatesController } from './media-based-message-templates.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MediaBasedMessageTemplatesController],
  providers: [MediaBasedMessageTemplatesService, ConfigService],
})
export class MediaBasedMessageTemplatesModule {}
