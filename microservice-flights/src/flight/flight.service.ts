import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import moment from 'moment';
import { Model } from 'mongoose';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { ILocation } from 'src/common/interfaces/location.interface';
import { IWeather } from 'src/common/interfaces/weather.interface';
import { FLIGHT } from 'src/common/models/models';
import { FlightDTO } from './dto/flight.dto';

@Injectable()
export class FlightService {
    constructor(@InjectModel(FLIGHT.name) private readonly model: Model<IFlight>) {}

    async getLocation(destinationCity: string): Promise<ILocation> {
        const { data } = await axios.get(
            `https://www.metaweather.com/api/location/search/?query=${destinationCity}`
        );
        return data[0];
    }

    async getWeather(woeid: number, flightDate: Date): Promise<IWeather[]> {
        const dateFormat = moment.utc(flightDate).format();

        const year = dateFormat.substring(0, 4);
        const month = dateFormat.substring(5, 7);
        const day = dateFormat.substring(8, 10);

        const { data } = await axios.get(
            `https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`
        );
        return data;
    }

    assign(
        {_id, pilot, airplane, destinationCity, flightDate, passengers}: IFlight,
        weather: IWeather[]
    ): IFlight {
        return {
            _id,
            pilot,
            airplane,
            destinationCity,
            flightDate,
            passengers,
            weather,
        }
    }

    async create(flightDTO: FlightDTO) {
        const newFlight = new this.model(flightDTO);
        return newFlight.save();
    }

    async findAll(): Promise<IFlight[]> {
        return this.model.find().populate('passengers');
    }

    async findOne(id: string): Promise<IFlight> {
        const flight = await this.model.findById(id).populate('passengers');
        const location: ILocation = await this.getLocation(flight.destinationCity);

        const weather: IWeather[] = await this.getWeather(
            location.woeid,
            flight.flightDate,
        )

        return this.assign(flight, weather);
    }

    async update(id: string, flightDTO: FlightDTO) {
        return this.model.findByIdAndUpdate(id, flightDTO, { new: true });
    }

    async delete(id: string) {
        await this.model.findByIdAndDelete(id);
        return {
            status: HttpStatus.OK,
            message: "Deleted",
        }
    }

    async addPassenger(flightId: string, passengerId: string): Promise<IFlight> {
        return this.model.findByIdAndUpdate(
            flightId,
            {
                $addToSet: { passengers: passengerId }
            },
            { new: true }
        ).populate('passengers');
    }
}
