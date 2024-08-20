import { expect } from 'chai';
import sinon from 'sinon';
import { Model } from 'mongoose';
import IPayment from '../../../src/Interfaces/IPayment';
import TransferService from '../../../src/Services/TransferService';
import Payment from '../../../src/Domain/Payment/Payment';
import PaymentStatus from '../../../src/utils/PaymentStatus';
import Key from '../../../src/Domain/Key/Key';

describe('Deveria criar uma transferência TRIX', function () {
  it('Deveria criar uma transferência TRIX com SUCESSO', async function () {
    const paymentInput: IPayment = {
      payByPerson: 'Jobs',
      payToPerson: 'Wozniak',
      amount: 50000,
      key: '858.898.670-16',
    };
    const paymentOutput: Payment = new Payment(
      'Jobs',
      'Wozniak',
      50000,
      '858.898.670-16',
      '63319d80feb9f483ee823ac5',
      PaymentStatus.completed,
    );

    const keyOutput = new Key(
      '442.456.489-20',
      'Wozniak',
      'cpf',
      '63319d80feb9f483ee823ac5',
    );

    sinon.stub(Model, 'create').resolves(paymentOutput);

    const service = new TransferService();
    const result = await service.transfer(paymentInput);

    expect(result).to.be.deep.equal(paymentOutput);
  });

  it('Deveria lançar uma exceção quando a key é inválida', async function () {
    const paymentInput: IPayment = {
      payByPerson: 'Jobs',
      payToPerson: 'Wozniak',
      amount: 50000,
      key: '858.898.670-16XX',
    };

    sinon.stub(Model, 'create').resolves({});

    try {
      const service = new TransferService();
      await service.transfer(paymentInput);
    } catch (error) {
      expect((error as Error).message).to.be.equal('Invalid Key!');
    }
  });

  afterEach(function () {
    sinon.restore();
  });
});