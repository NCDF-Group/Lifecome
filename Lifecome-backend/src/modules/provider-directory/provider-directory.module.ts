import { Module } from '@nestjs/common';

import { ProviderDirectoryController } from './provider-directory.controller';
import { ProviderDirectoryService } from './provider-directory.service';

@Module({
  controllers: [ProviderDirectoryController],
  providers: [ProviderDirectoryService],
  exports: [ProviderDirectoryService],
})
export class ProviderDirectoryModule {}
