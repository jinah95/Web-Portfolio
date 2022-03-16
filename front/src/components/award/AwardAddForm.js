import React, {useState, useContext} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import * as Api from "../../api";
import { UserStateContext } from "../../App";

// 수상이력 추가 컴포넌트로 {폼 활성화 여부 state}, {user.id}, {리스트 업데이트 함수}를 props로 받아옵니다. 
function AwardAddForm ({setAddAward, setAwardLists}) {
    // 수상내역, 상세내역 state 
    const userState = useContext(UserStateContext);
    const user_id = userState.user.id;

    const [awardTitle, setAwardTitle] = useState('');
    const [awardDetail, setAwardDetail] = useState('');
    // **확인 버튼 시, 보내질 form data 형식&내용 ** 확인버튼 구현 예정 (submit)

    const addSubmitHandler = async (e) => {
        e.preventDefault();
    
  
        const uptAwardData = {
          user_id,
          title: awardTitle,
          description: awardDetail,
        };
    
        await Api.post("award/create", uptAwardData);
    
        
        const updateList = await Api.get("awardlist", user_id);
        setAwardLists(updateList.data);
    
        setAddAward(false);
      };
    
    
    return(
        <Form onSubmit={addSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="수상내역" value={awardTitle} onChange={(e)=>setAwardTitle(e.target.value)}/>
            </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="text" placeholder="상세내역" value={awardDetail} onChange={(e)=>setAwardDetail(e.target.value)}/>
        </Form.Group>
        <Row className="text-center">
            <Col>
                <Button variant="primary" type="submit" style={{marginRight: '10px'}}>
                    확인
                </Button>{' '}     
                <Button variant="secondary" type="button" onClick={()=>setAddAward(false)} >
                    취소
                </Button>
            </Col>
        </Row>
        </Form>

    )
}

export default AwardAddForm;
