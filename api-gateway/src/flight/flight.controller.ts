import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { FlightMSG, PassengerMSG } from 'src/common/constants';
import { IFlight } from 'src/common/interfaces/flight.interface';
import { ClientProxySuperFlights } from 'src/common/proxy/client-proxy';
import { FlightDTO } from './dto/flight.dto';

@ApiTags('flights')
@Controller('api/v2/flight')
export class FlightController {
  constructor(private readonly clientProxy: ClientProxySuperFlights) {}
  private _clientProxyFlight = this.clientProxy.clientProxyFlights();
  private _clientProxyPassenger = this.clientProxy.clientProxyPassengers();

  @Post()
  create(@Body() flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.CREATE, flightDTO);
  }

  @Get()
  findAll(): Observable<IFlight[]> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ALL, '');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.FIND_ONE, id);
  }

  @Put(':id')
  update(@Param('id') id: string, flightDTO: FlightDTO): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.UPDATE, {
      id,
      flightDTO,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Observable<IFlight> {
    return this._clientProxyFlight.send(FlightMSG.DELETE, id);
  }

  @Post(':flightId/passenger/:passengerId')
  async addPassenger(
    @Param('flightId') flightId: string,
    @Param('passengerId') passengerId: string,
  ) {
    const passenger = await this._clientProxyPassenger
      .send(PassengerMSG.FIND_ONE, passengerId)
      .toPromise();

    if (!passenger) {
      throw new HttpException('Passenger Not Found', HttpStatus.NOT_FOUND);
    }

    return this._clientProxyFlight.send(FlightMSG.ADD_PASSENGER, {
      flightId,
      passengerId,
    });
  }
}
