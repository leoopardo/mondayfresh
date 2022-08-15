import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async create(payload: any) {
    try {
      let query = {
        query: `query {\n    items (ids: ${payload.body.event.pulseId}) {\n      column_values {\n        id\n        value\n      }\n    }\n}\n\t`,
      };
      const headers = {
        'Content-Type': 'application/json',
        Authorization: this.configService.get('monday.api_key'),
      };
      const ApiKey = Buffer.from(
        `${this.configService.get('freshservice.api_key')}:x`,
      ).toString('base64');
      const freshserviceHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ApiKey}`,
      };
      const board = await firstValueFrom(
        this.httpService.post('https://api.monday.com/v2', query, {
          headers: headers,
        }),
      );
      let itemColumnValues = await board.data.data.items[0].column_values;
      let index = JSON.parse(itemColumnValues[1].value).index;
      let priority;

      if (index === 109) {
        priority = 1;
      } else if (index === 10) {
        priority = 3;
      } else {
        priority = 2;
      }

      let updateTicket = {
        priority,
      };

      await itemColumnValues.map(async (column) => {
        try {
          console.log(JSON.parse(column.value));

          if (column.id === 'texto' && column.value) {
            console.log(freshserviceHeaders);
            let response = await firstValueFrom(
              this.httpService.put(
                `https://loupen-ninjastest.freshservice.com/api/v2/tickets/${
                  column.value.split('-')[1].split('"')[0]
                }`,
                updateTicket,
                {
                  headers: freshserviceHeaders,
                },
              ),
            );
            console.log(response);
          }
        } catch (err) {
          console.error(err.response.data, 'erro');
        }
      });

      console.log(payload.body.event.pulseId, 'service');
    } catch (err) {
      console.error(err);
    }
  }
}
