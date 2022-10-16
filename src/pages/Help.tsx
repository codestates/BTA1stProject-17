import { useAppDispatch } from '@/app/store';
import { useEffect } from 'react';
import { setHelpLayout } from '@/slices/helpLayoutSlice';

// TODO: 작업 완료 후 린트 활성화
/* eslint-disable */
interface HelpProps {
  
}

function Help({}: HelpProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHelpLayout({ description: '환영합니다!\n헤데라 해시태그가 처음이신가요?' }))
  }, [])

  return (
    <div>
      헬프
    </div>
  );
};

export default Help;