import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { EmojiIcon } from "./emoji";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      showEmojiPicker && setShowEmojiPicker(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setCurrentMessage((prevMessage) => prevMessage + emoji.native);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <div>
          <input
            type="text"
            value={currentMessage}
            placeholder="Hey.."
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyDown={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
        </div>

        <div className="chat-footer-btn_wrapper">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            style={{
              marginRight: "40px",
            }}
          >
            <span
              style={{
                height: "25px",
                width: "25px",
                color: "black",
              }}
            >
              <EmojiIcon />
            </span>
          </button>
          {showEmojiPicker && (
            <Picker
              data={data}
              onEmojiSelect={handleEmojiClick}
              title="Odaberi smajlića"
              emoji="point up"
            />
          )}
          <button onClick={sendMessage} className="chat-footer-btn-submit">
            &#9658;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
