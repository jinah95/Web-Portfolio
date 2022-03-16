import React, { useState } from 'react';
import {Form, Row, Col, Button} from "react-bootstrap";
import * as Api from "../../api";

function AwardEditForm ({award, setIsEditing, setAwardList, portfolioOwnerId}){
    const [awardtitle, setAwardtitle] = useState(award.title);
    const [awardDtail, setAwardDtail] = useState(award.description);

    async function editSubmitHandler (e) {
        e.preventDefault();
        await Api.put(`awards/${award.id}`, {
            title: awardtitle,
            description: awardDtail
        })
        const editData = await Api.get('awardlist', portfolioOwnerId)
        setAwardList(editData)
        setIsEditing(false)
    }

    return(

            <Form onSubmit={(e)=> editSubmitHandler(e)}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control type="text" placeholder={award.title} value={awardtitle} onChange={(e)=>setAwardtitle(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control type="text" class='text-muted' placeholder={award.description} value={awardDtail} onChange={(e)=>setAwardDtail(e.target.value)}/>
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