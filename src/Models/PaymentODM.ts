import {
  Model, Schema, UpdateQuery, isValidObjectId, model, models,
} from 'mongoose';
import IPayment from '../Interfaces/IPayment';

class PaymentODM {
  private schema: Schema;
  private model: Model<IPayment>;

  constructor() {
    this.schema = new Schema<IPayment>({
      payByPerson: { type: String, required: true },
      payToPerson: { type: String, required: true },
      amount: { type: Number, required: true },
      key: { type: String, required: true },
      status: { type: Number },
    });

    // Antes de criar o Schema, verificar se o schema já existe. Caso não exista, o schema será criado.
    this.model = models.Payment || model('Payment', this.schema);
  }

  public async create(payment: IPayment): Promise<IPayment> {
    return this.model.create({ ...payment });
  }

  public async find(): Promise<IPayment[]> {
    return this.model.find();
  }

  public async update(id: string, entity: Partial<IPayment>):
  Promise<IPayment | null> {
    if (!isValidObjectId(id)) throw Error('Invalid Mongo ID!');

    return this.model.findByIdAndUpdate(
      { _id: id },
      { ...entity } as UpdateQuery<IPayment>,
      { new: true },
    );
  }

  public async findByKey(key: string): Promise<IPayment[]> {
    return this.model.find({ key });
  }
}

export default PaymentODM;