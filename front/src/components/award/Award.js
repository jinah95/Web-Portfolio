import React, {useState} from 'react';
import {Card, Row, Col, Button} from "react-bootstrap";
import AwardEditForm from './AwardEditForm';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';



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
            <Card.Text>
                <Row className="align-items-center">
                    <Col>
                        <span >{award.title}</span>
                        <br />
                        <span class='text-muted'>{award.description}</span>
                    </Col> 
                    {isEditable&&
                        <Col xs lg="1">
                            <Fab color="secondary" aria-label="edit" size="small" onClick={()=>setIsEditing(true)}>
                                <EditIcon />
                            </Fab>
                        </Col>
                    }
                </Row>
            </Card.Text>
            )}
        </>
    )
    
}

export default Award;

