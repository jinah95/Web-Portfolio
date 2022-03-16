import React, {useState} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import * as Api from "../../api";

// 수상이력 추가 컴포넌트로 {폼 활성화 여부 state}, {user.id}, {리스트 업데이트 함수}를 props로 받아옵니다. 
function AwardAddForm ({setAddAward, portfolioOwnerId, setAwardList}) {
    // 수상내역, 상세내역 state 
    const [awardtitle, setAwardtitle] = useState('');
    const [awardDtail, setAwardDtail] = useState('');
    // **확인 버튼 시, 보내질 form data 형식&내용 ** 확인버튼 구현 예정 (submit)
    async function addSubmitHandler (e) {
        e.preventDefault();
        const uptAwardData = {
            userId: portfolioOwnerId,
            title: awardtitle,
            description: awardDtail,
        }
        
        // ** 데이터를 보내고, ** 수정 ** 보낸 데이터를 기존 리스트에 추가 후, setAwardList에 업데이트 해야함 
        await Api.post('award/create', uptAwardData)
    
        const updateList = await Api.get('awardlist', portfolioOwnerId )
        setAwardList(updateList);
        setAddAward(false)
    }

    return(
        <Form onSubmit={(e)=> addSubmitHandler(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control type="text" placeholder="수상내역" value={awardtitle} onChange={(e)=>setAwardtitle(e.target.value)}/>
            </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control type="text" placeholder="상세내역" value={awardDtail} onChange={(e)=>setAwardDtail(e.target.value)}/>
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
