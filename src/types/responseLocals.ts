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
  designSuggestionId?: number;
  textElementId?: number;
  pulloverId?: number;
  imageToDesignId?: number;
}

type ParamKey = keyof ResponseLocalsParams;
