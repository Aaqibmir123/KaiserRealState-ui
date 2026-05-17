export type DealMode = 'buy' | 'sell';

export type BuyDeal = {
  id: string;
  title: string;
  location: string;
  areaSize: string;
  purchasePrice: string;
  purchasedFromName: string;
  purchasedFromPhone: string;
  purchaseDate: string;
  landImage: string;
  aadhaarCardImage: string;
  geoTagImage: string;
  isClosed: boolean;
  createdAt: string;
};

export type SellDeal = {
  id: string;
  sourceBuyId: string;
  soldToName: string;
  soldToPhone: string;
  soldToLocation: string;
  soldToAadhaarNumber: string;
  soldToAadhaarImage: string;
  sellDate: string;
  sellPrice: string;
  dealClosed: boolean;
  createdAt: string;
};

export type FormValues = {
  title: string;
  location: string;
  areaSize: string;
  purchasePrice: string;
  purchasedFromName: string;
  purchasedFromPhone: string;
  purchaseDate: string;
  landImage: string;
  aadhaarCardImage: string;
  geoTagImage: string;
  sourceBuyId: string;
  soldToName: string;
  soldToPhone: string;
  soldToLocation: string;
  soldToAadhaarNumber: string;
  soldToAadhaarImage: string;
  sellDate: string;
  sellPrice: string;
  dealClosed: boolean;
};

export const today = () => new Date().toISOString().slice(0, 10);

export const createDraft = (_mode: DealMode, sourceBuyId = ''): FormValues => ({
  title: '',
  location: '',
  areaSize: '',
  purchasePrice: '',
  purchasedFromName: '',
  purchasedFromPhone: '',
  purchaseDate: today(),
  landImage: '',
  aadhaarCardImage: '',
  geoTagImage: '',
  sourceBuyId,
  soldToName: '',
  soldToPhone: '',
  soldToLocation: '',
  soldToAadhaarNumber: '',
  soldToAadhaarImage: '',
  sellDate: today(),
  sellPrice: '',
  dealClosed: true
});
