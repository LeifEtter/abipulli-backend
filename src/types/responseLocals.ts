interface ResponseLocalsUser {
  user_id: number;
  role_power: number;
}

interface ResponseLocalsParams {
  id?: number;
  userId?: number;
  orderId?: number;
  imageId?: number;
  designId?: number;
  chatId?: number;
  messageId?: number;
}

type ParamKey = keyof ResponseLocalsParams;
