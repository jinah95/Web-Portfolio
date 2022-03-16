import React from 'react';
import AwardCard from './AwardCard';

// 세부 내용은 AwardCard에 다 담았습니다.
function Awards ({portfolioOwnerId, isEditable}) {

    return (
            <>
             <AwardCard portfolioOwnerId={portfolioOwnerId} isEditable={isEditable}/>
            </> 
    )
}

export default Awards;



