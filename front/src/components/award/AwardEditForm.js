import React, { useState,useContext } from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";
import * as Api from "../../api";
import { UserStateContext } from "../../App";

function AwardEditForm ({award, setIsEditing, setAwardLists}){
    const userState = useContext(UserStateContext);

    const [awardTitle, setAwardTitle] = useState(award.title);
    const [awardDetail, setAwardDetail] = useState(award.description);

    const user_id = userState.user.id;

    const editSubmitHandler = async (e) => {
        e.preventDefault();

        const edtAwardData = {
            user_id,
            title: awardTitle,
            description: awardDetail,
          }; 

        await Api.put(`awards/${award.id}`, edtAwardData)
    
        const editData = await Api.get('awardlist', user_id)
        setAwardLists(editData.data);
        setIsEditing(false);
    }

    return(

            <Form onSubmit={editSubmitHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder={award.title} value={awardTitle} onChange={(e)=>setAwardTitle(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="text" class='text-muted' placeholder={award.description} value={awardDetail} onChange={(e)=>setAwardDetail(e.target.value)}/>
                </Form.Group>
                <Row className="text-center" style={{marginBottom: '20px'}}>
                    <Col>
                        <Button variant="primary" type="submit" style={{marginRight: '10px'}}>
                            확인
                        </Button>{' '}     
                        <Button variant="secondary" type="button" onClick={()=>setIsEditing(false)} >
                            취소
                        </Button>
                     </Col>
                </Row>
            </Form> 
            
    )
}

export default AwardEditForm;