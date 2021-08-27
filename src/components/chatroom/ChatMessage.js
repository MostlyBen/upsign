const ChatMessage = (props) => {
  const { text, uid } = props.message;
  return <p key={uid}>{text}</p>
}

export default ChatMessage