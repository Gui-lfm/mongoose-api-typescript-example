import Payment from '../Domain/Payment/Payment';
import IPayment from '../Interfaces/IPayment';
import PaymentODM from '../Models/PaymentODM';

class TransferService {
  private isValidKey(key: string): boolean {
    const cpfRegexp = /^\d{3}.\d{3}.\d{3}-\d{2}$/;
    return cpfRegexp.test(key);
  }

  private createPaymentDomain(payment: IPayment | null): Payment | null {
    if (payment) {
      return new Payment(
        payment.payByPerson,
        payment.payToPerson,
        payment.amount,
        payment.key,
        payment.id,
        payment.status,
      );
    }
    return null;
  }

  public async transfer(payment: IPayment) {
    if (!this.isValidKey(payment.key)) throw new Error('Invalid Key!');

    // Criar instância da Model de Payment usando Mongoose
    const paymentODM = new PaymentODM();
    // Inserir os dados no banco
    const newPayment = await paymentODM.create(payment);
    // Retornar os dados com o id
    return this.createPaymentDomain(newPayment);
  }

  public async getTransfers() {
    const paymentODM = new PaymentODM();
    // busca os dados no banco
    const payments = await paymentODM.find();

    const paymentList = payments.map((payment) =>
      this.createPaymentDomain(payment));

    return paymentList;
  }

  public async getTransferByKey(key: string) {
    const paymentODM = new PaymentODM();

    const payments = await paymentODM.findByKey(key);

    const paymentArray = payments.map((payment) =>
      this.createPaymentDomain(payment));

    return paymentArray;
  }

  public async undoTransfer(id: string, payment: IPayment) {
    if (!this.isValidKey(payment.key)) throw Error('Invalid Key!');
    const paymentODM = new PaymentODM();

    return paymentODM.update(id, payment);
  }
}

export default TransferService;