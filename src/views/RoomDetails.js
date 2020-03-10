import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { firestore, auth } from '../firebase/firebase';
import Heading from '../components/atoms/Heading/Heading';
import AddMessage from '../components/molecules/AddMessage';
import MessagesList from '../components/molecules/MessagesList';
import useSubscription from '../hooks/useSubscription';
import useRefScroll from '../hooks/useRefScroll';
import useCollection from '../hooks/useCollection';
import PageTemplate from '../templates/PageTemplate';

const StyledDiv = styled.div`
  width: 100%;
  height: 90vh;
  max-height: 90vh;
  border: 1px solid #e6ecf1;
  position: relative;
`;

const StyledHeadingWrapper = styled.div`
  width: 100%;
  height: 10%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: 1px solid #e6ecf1;
  padding: 2rem 3rem;
`;

const StyledChatWrapper = styled.div`
  width: 100%;
  height: auto;
  max-height: 80%;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  justify-items: flex-start;
  overflow: scroll;
  position: relative;
`;

const RoomDetails = () => {
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const { id } = useParams();

  const chatRef = useRef(null);

  const roomRef = firestore.doc(`rooms/${id}`);
  const messageRef = roomRef.collection(`messages`);

  const currentUser = auth.currentUser;

  useSubscription(messageRef, setMessages);
  useCollection(roomRef, setRoom);
  useRefScroll(chatRef, messages);

  window.messages = messages;
  window.room = room;
  return (
    <PageTemplate>
      <StyledDiv>
        <StyledHeadingWrapper>
          <Heading>{room ? room.title : ''}</Heading>
        </StyledHeadingWrapper>
        <StyledChatWrapper ref={chatRef}>
          <MessagesList currentUser={currentUser} messages={messages} />
        </StyledChatWrapper>
        <AddMessage messageRef={messageRef} />
      </StyledDiv>
    </PageTemplate>
  );
};

export default RoomDetails;
