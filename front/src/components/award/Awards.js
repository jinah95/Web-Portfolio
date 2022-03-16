import React from 'react';
import AwardCard from './AwardCard';

// 세부 내용은 AwardCard에 다 담았으며, 추가 컴포넌트 없을 시, 해당 파일은 필요없을 수도 있을것 같습니다. (컴포넌트 하나만 받아와서)
function Awards ({portfolioOwnerId, isEditable}) {

    return (
            <>
             <AwardCard portfolioOwnerId={portfolioOwnerId} isEditable={isEditable}/>
            </> 
    )
}

export default Awards;

