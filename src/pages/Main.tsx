import { useNavigate } from 'react-router-dom';

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
interface MainProps {
  
}

function Main({}: MainProps) {
  const navigate = useNavigate();

  return <>
    <button onClick={() => navigate('/help')}>
      헬프 페이지 가기
    </button>
    <button onChange={() => navigate('/wallet')}>
      월렛 페이지 가기
    </button>
  </>
};

export default Main;