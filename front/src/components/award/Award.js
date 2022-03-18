import React, {useState} from 'react';
import {Card, Row, Col, Button} from "react-bootstrap";
import AwardEditForm from './AwardEditForm';


// 뿌려지는 수상이력 개별이 갖는 구조 컨퍼넌트 입니다. 
function Award ({award, isEditable, setAwardLists}) {
    // 편집 버튼 클릭 시, AwardEditForm이 활성화 되도록 하는 state 입니다. 
    const [isEditing, setIsEditing] = useState(false);

    return (
         <>  
         {isEditing
          ? (
            <AwardEditForm award={award} isEditable={isEditable} setIsEditing={setIsEditing} setAwardLists={setAwardLists}/>
            )
          :(   
            <Row className="align-items-center">
                <Col>
                    <p >{award.title}</p>
                    <p className='text-muted'>{award.description}</p>
                </Col> 
                {isEditable&&
                    <Col xs lg="1">
                        <Button variant="outline-info" size="sm" className="mr-3" onClick={()=>setIsEditing(true)}>편집</Button>
                    </Col>
                }
            </Row>
            )}
        </>
    )
    
}

export default Award;