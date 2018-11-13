import { BaseEntity } from 'typeorm';

export default async function upsert(Model: typeof BaseEntity, payload: any) {
  if (payload.id) {
    const m = new Model();
    Object.assign(m, payload);
    return m.save();
  } else {
    return Model.insert(payload);
  }
}
