
export enum StyleType {
  ThreeD = '3D 스타일',
  Cartoon = '만화 스타일',
  Disney = '디즈니 스타일',
  OutFocusing = '아웃포커싱',
  Caricature = '캐리커처 스타일',
}

export interface StyleOption {
  id: StyleType;
  name: string;
  prompt: string;
  className: string;
}