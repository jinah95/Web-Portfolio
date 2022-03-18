import React, { useState,useContext } from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";
import * as Api from "../../api";
import { UserStateContext } from "../../App";

// 수상이력 수정 컴포넌트로, {해당 수상내역}, {수정 컴포넌트 활성화 state}, {수상이력리스트 업데이트 함수} 를 props로 받아옵니다.
function AwardEditForm ({award, setIsEditing, setAwardLists}){
    // 수정은 본인만 가능하므로, 현재 접속중인 userid를 사용합니다. 
    const userState = useContext(UserStateContext);
    const user_id = userState.user.id;

    // 수상내역, 상세내역을 state로 관리합니다. 
    const [awardTitle, setAwardTitle] = useState(award.title);
    const [awardDetail, setAwardDetail] = useState(award.description);

    const titleChange = (e) => {
        console.log('title을 바꿈')
        setAwardTitle(e.target.value); 
    }
    
    const detailChange = (e) => {
        console.log('detail을 바꿈')
        setAwardDetail(e.target.value); 
    }

    // 입력받은 값으로 수상이력을 수정하고, 목록을 다시 업데이트 합니다. 
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
                    <Form.Control type="text" placeholder={award.title} value={awardTitle} onChange={titleChange}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="text" class='text-muted' placeholder={award.description} value={awardDetail} onChange={detailChange}/>
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
