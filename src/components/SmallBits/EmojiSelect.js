import EmojiPicker from 'emoji-picker-react';


const EmojiSelect = ({ open, onSubmit }) => {

  const handleClickEmoji = (e) => {
    console.log("Emoji clicked!:", e)
    onSubmit(e.unified)
  }

  return (
    <div className="emoji-select-list">
      <EmojiPicker
        onReactionClick={handleClickEmoji}
        onEmojiClick={handleClickEmoji}
        reactionsDefaultOpen="true"
        skinTonesDisabled="true"
        lazyLoadEmojis="true"
        emojiStyle="apple"
        theme="auto"
        previewConfig={{showPreview: false}}
        open={open}
        reactions={[
          "1f389", // 🎉
          "1f90f", // 🤏
          "1f345", // 🍅
          "1f634", // 😴
        ]}
        className="emoji-picker-react"
      />
    </div>
  )
}

export default EmojiSelect