import React, {useState, useContext} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import * as Api from "../../api";
import { UserStateContext } from "../../App";

// 수상이력 추가 컴포넌트로 {폼 활성화 여부 state}, {수상이력리스트 업데이트 함수}를 props로 받아옵니다. 
function AwardAddForm ({setAddAward, setAwardLists}) {
    // 추가는 본인만 가능하므로, 현재 접속중인 userid를 사용합니다.
    const userState = useContext(UserStateContext);
    const user_id = userState.user.id;

    // 수상내역, 상세내역을 state로 관리합니다. 
    const [awardTitle, setAwardTitle] = useState('');
    const [awardDetail, setAwardDetail] = useState('');  

    // 입력받은 값으로 수상이력에 추가하고, 목록을 다시 업데이트 합니다. 
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



