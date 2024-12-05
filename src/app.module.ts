import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaBasedMessageTemplatesModule } from './media-based-message-templates/media-based-message-templates.module';

@Module({
  imports: [ConfigModule.forRoot(), MediaBasedMessageTemplatesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
