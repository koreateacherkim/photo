import { StyleType, StyleOption } from './types';

export const STYLE_OPTIONS: StyleOption[] = [
  {
    id: StyleType.ThreeD,
    name: '3D',
    prompt: '이 이미지를 3D 픽사 스타일 렌더링으로 변환해줘. 피사체의 특징은 유지하면서 세련된 3차원 모양으로 만들어줘.',
    className: 'from-sky-500 to-indigo-500',
  },
  {
    id: StyleType.Cartoon,
    name: '만화',
    prompt: '이 이미지를 생생하고 고전적인 2D 만화 스타일로 다시 그려줘. 굵은 윤곽선과 단색을 사용해줘.',
    className: 'from-yellow-400 to-orange-500',
  },
  {
    id: StyleType.Disney,
    name: '디즈니',
    prompt: '이 사진을 고전 디즈니 애니메이션 영화 캐릭터 스타일로 변환해줘. 크고 표현력이 풍부한 눈과 부드러운 특징을 강조해줘.',
    className: 'from-purple-500 to-pink-500',
  },
  {
    id: StyleType.OutFocusing,
    name: '아웃포커싱',
    prompt: '이 이미지를 디오라마처럼 보이게 만들어줘. 전체적으로 초점이 흐릿한 느낌을 주면서 특정 부분만 아주 선명하게 표현해줘. 색감은 실제보다 더 밝고 화사하게 만들어줘.',
    className: 'from-green-400 to-teal-500',
  },
  {
    id: StyleType.Caricature,
    name: '캐리커처',
    prompt: '이 사진으로 재미있는 캐리커처를 만들어줘. 피사체의 가장 두드러진 특징을 장난스럽고 예술적인 방식으로 과장해줘.',
    className: 'from-red-500 to-rose-500',
  },
];