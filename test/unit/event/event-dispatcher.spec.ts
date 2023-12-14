import Chance from 'chance';

import { EventDispatcher } from '../../../src/shared/event/event-dispatcher';
import { EventInterface } from '../../../src/shared/event/event.interface';
import { EventHandlerInterface } from '../../../src/shared/event/event-handler.interface';

const chance = Chance();
const customerData = {
  name: chance.name(),
  email: chance.email(),
  cpf: chance.cpf({ formatted: true }),
};

const makeCustomerCreatedEvent = () => {
  class CustomerCreatedEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: any;

    constructor() {
      this.dataTimeOccurred = new Date();
      this.eventData = customerData;
    }
  }

  return new CustomerCreatedEvent();
};

const makeEventHandler = () => {
  class SendEmailWhenCustomerIsCreatedHandler
    implements EventHandlerInterface<EventInterface>
  {
    handle(event: EventInterface): void {
      expect(event.constructor.name).toStrictEqual('CustomerCreatedEvent');
    }
  }

  return new SendEmailWhenCustomerIsCreatedHandler();
};

const makeSUT = () => {
  return new EventDispatcher();
};

describe.only('# Test Unit Event Dispatcher', () => {
  const event = 'CustomerCreatedEvent';

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-01'));
  });

  it('Deve registrar um evento "CustomerCreatedEvent" corretamente', () => {
    const eventDispatcher = makeSUT();
    const eventHandler = makeEventHandler();

    eventDispatcher.register(event, eventHandler);

    expect(eventDispatcher.getEventHandlers[event].length).toStrictEqual(1);
    expect(eventDispatcher.getEventHandlers[event][0]).toEqual(eventHandler);
  });

  it('Deve desregistrar um evento "CustomerCreatedEvent" corretamente', () => {
    const eventDispatcher = makeSUT();
    const eventHandler = makeEventHandler();

    eventDispatcher.register(event, eventHandler);
    eventDispatcher.unregister(event, eventHandler);

    expect(eventDispatcher.getEventHandlers[event].length).toStrictEqual(0);
  });

  it('Deve desregistrar todos os eventos corretamente', () => {
    const eventDispatcher = makeSUT();
    const eventHandler = makeEventHandler();

    eventDispatcher.register(event, eventHandler);
    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers[event]).toBeUndefined();
  });

  it('Deve disparar um evento "CustomerCreatedEvent" corretamente', () => {
    const eventDispatcher = makeSUT();
    const eventHandler = makeEventHandler();
    const customerCreatedEvent = makeCustomerCreatedEvent();

    const spyEventHandler = jest.spyOn(eventHandler, 'handle');

    eventDispatcher.register(event, eventHandler);

    expect(eventDispatcher.getEventHandlers[event][0]).toMatchObject(
      eventHandler
    );

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalledWith({
      dataTimeOccurred: new Date('2023-01-01T00:00:00.000Z'),
      eventData: customerData,
    });
  });
});
