import { FolderCategory, JobNewsItem } from './types';

export const PREDEFINED_KEYWORDS = [
  "리더십", "팀워크", "문제해결", "데이터분석", "기획력", "의사소통", "창의성", "도전정신",
  "성실함", "책임감", "발표능력", "문서작성", "코딩", "디자인", "마케팅", "영업", "회계",
  "글로벌", "외국어", "멘토링", "봉사", "수상", "자격증", "협상", "위기관리", "시간관리",
  "적응력", "분석력", "논리적사고", "전략수립", "프로젝트관리", "연구", "실험", "개발",
  "고객응대", "판매", "운영", "관리", "교육", "상담", "영상편집", "UI/UX", "브랜딩",
  "카피라이팅", "SNS운영", "시장조사", "통계", "머신러닝", "AI", "클라우드"
];

export const MOCK_JOB_NEWS: JobNewsItem[] = [
  {
    id: '1',
    title: '2025년 상반기 신입 공채',
    company: '삼성전자',
    deadline: '2024.03.15',
    tags: ['신입', '개발', '기획'],
    content: '2025년 상반기 3급 신입사원 채용 공고입니다. 자세한 내용은 채용 홈페이지를 참고하세요.'
  },
  {
    id: '2',
    title: 'AI 엔지니어 경력직 채용',
    company: 'NAVER',
    deadline: '2024.02.28',
    tags: ['경력', 'AI', 'ML'],
    content: 'HyperCLOVA X 팀에서 함께 성장할 AI 엔지니어를 모십니다.'
  },
  {
    id: '3',
    title: '서비스 기획 인턴 모집',
    company: '우아한형제들',
    deadline: '2024.04.01',
    tags: ['인턴', '기획', 'PM'],
    content: '배달의민족 서비스 기획팀에서 체험형 인턴을 모집합니다.'
  },
  {
    id: '4',
    title: 'Global Business Developer',
    company: 'Kakao',
    deadline: '2024.03.20',
    tags: ['신입/경력', '비즈니스', '영어'],
    content: '카카오의 글로벌 확장을 주도할 비즈니스 디벨로퍼를 찾습니다.'
  }
];

export const FOLDERS_LIST = Object.values(FolderCategory);