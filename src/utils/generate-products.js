import { faker } from "@faker-js/faker";

faker.locale = "es";

export const generateProduct = () => {
  return {
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    code: faker.datatype.uuid(),
    price: faker.datatype.number({
        min: 1,
        max:30000,
    }),
    status: faker.datatype.boolean(),
    stock: faker.datatype.number({
      min: 0,
      max: 100,
    }),
    category: faker.commerce.department(),
    thumbnails: faker.image.imageUrl(),
    id: faker.database.mongodbObjectId(),
  };
};