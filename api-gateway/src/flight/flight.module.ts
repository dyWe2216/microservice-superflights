import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { FlightController } from './flight.controller';

@Module({
  imports: [ProxyModule],
  controllers: [FlightController],
})
export class FlightModule {}
