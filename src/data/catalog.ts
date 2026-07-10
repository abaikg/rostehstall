export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  isNew?: boolean;
  price?: string;
  priceUnit?: string;
  slug: string;
  imgQuery: string;
  image?: string;
  desc?: string;
  gost?: string;
  steelGrade?: string;
  size?: string;
  thickness?: string;
  weightMeter?: string;
  weightSquareMeter?: string;
  weightItem?: string;
  specs?: Spec[];
  features?: string[];
}

export const products: Product[] = [];

export const CATEGORY_LIST: { name: string; icon: string }[] = [
  { name: "Трубный прокат", icon: "pipe" },
  { name: "Трубопроводная арматура", icon: "valve" },
  { name: "Качественные стали", icon: "special" },
  { name: "Нержавеющая продукция", icon: "stainless" },
  { name: "Метизы", icon: "hardware" },
  { name: "Сортовой прокат", icon: "bars" },
  { name: "Фасонный прокат", icon: "profile" },
  { name: "Цветной металл", icon: "color-metal" },
  { name: "Листовой прокат", icon: "sheet" },
];

export const productCategories = CATEGORY_LIST.map((category) => category.name);
