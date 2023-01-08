import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PASSENGER } from "src/common/models/models";
import { PassengerController } from "./passenger.controller";
import { PassengerService } from "./passenger.service";
import { PassengerSchema } from "./schema/passenger.schema";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: PASSENGER.name,
                useFactory: () => PassengerSchema,
            }
        ])
    ],
    controllers: [ PassengerController ],
    providers: [ PassengerService ]
})
export class PassengerModule {}