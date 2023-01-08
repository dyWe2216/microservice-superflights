import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FLIGHT, PASSENGER } from 'src/common/models/models';
import { FlightController } from './flight.controller';
import { FlightService } from './flight.service';
import { FlightSchema } from './schema/flight.schema';
import { PassengerSchema } from './schema/passenger.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
        {
            name: FLIGHT.name,
            useFactory: () => FlightSchema.plugin(require('mongoose-autopopulate')),
        },
        {
            name: PASSENGER.name,
            useFactory: () => PassengerSchema,
        }
    ])
  ],
  controllers: [FlightController],
  providers: [FlightService]
})
export class FlightModule {}
