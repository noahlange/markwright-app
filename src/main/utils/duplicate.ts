import { BaseEntity } from 'typeorm';

export default async function duplicate(Model: typeof BaseEntity, id: number) {
  // throw away id
  const { id: _id, ...data } = (await Model.findOne(id)) as any;
  await Model.insert(data.id, data);
}
