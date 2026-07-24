export const getEffectivePrice = (product) => product.discountPrice || product.price || 0;
