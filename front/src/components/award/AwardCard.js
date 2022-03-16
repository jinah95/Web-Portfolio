import React, {useState, useEffect, useContext} from 'react';
import {Card, Row, Col, Button} from "react-bootstrap";
import AwardAddForm from "./AwardAddForm";
import Award from './Award';
import * as Api from "../../api";
import { UserStateContext } from "../../App";

// 메인 컴포넌트라고 할 수 있습니다. 
// portfolioOwnerId = user.id 로, 유저별 데이터를 불러오거나 작성시 필요 
function AwardCard ({portfolioOwnerId, isEditable}) {
    // award 추가할 폼을 열고 닫는 토글 기능 
    const [addAward, setAddAward] = useState(false);
    // 추가한 리스트들이 잘 뿌려지는지 가짜 데이터 (추후 삭제 예정)
    const userState = useContext(UserStateContext);

    const user_id = userState.user.id;

   // api가 완성된다면, 가짜데이터가 아닌, 불러온 데이터로 수상이력목록을 업데이트 할 예정
   // 이 때, user.id가 바뀌면 수상리스트를 다시 불러옴 
    const [awardLists, setAwardLists] = useState([])

    useEffect(() =>
        Api.get("awardlist", portfolioOwnerId).then((res) => setAwardLists(res.data))
    ,[portfolioOwnerId])

    return(
    <>
      <Card className="ml-3">
        <Card.Body>
          <Row>
            <Card.Title>수상이력</Card.Title>
          </Row>
          <Row>
            {awardLists.map((award) =>
              <Award award={award} isEditable={isEditable} setAwardLists={setAwardLists}/>
            )}
          </Row>
          {isEditable&&(
            <Row className="text-center">
            <Col>
              <Button
                variant="primary"
                onClick={()=>setAddAward(true)}>
                +
              </Button><br />  <br />  
            </Col> 
          </Row>
          )}
          
           {addAward&&(
            <Row>
                <AwardAddForm setAddAward={setAddAward} setAwardLists={setAwardLists}/>
            </Row>
           )}
        </Card.Body>
      </Card>
    </>

    
    )
}

export default AwardCard;
