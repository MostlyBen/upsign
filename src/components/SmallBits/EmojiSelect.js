import EmojiPicker from 'emoji-picker-react';


const EmojiSelect = ({ open, onSubmit, reactions, reactionsOpen=true }) => {

  const handleClickEmoji = (e) => {
    console.log("Emoji clicked!:", e)
    onSubmit(e.unified)
  }

  return (
    <div className="emoji-select-list" style={{padding: '18px', display: open ? '' : 'none', transform: 'translateY(-12px)'}}>
      <EmojiPicker
        onReactionClick={handleClickEmoji}
        onEmojiClick={handleClickEmoji}
        reactionsDefaultOpen={(Array.isArray(reactions) && !reactions.length) ? false : reactionsOpen}
        skinTonesDisabled="true"
        lazyLoadEmojis="true"
        emojiStyle="apple"
        theme="auto"
        previewConfig={{showPreview: false}}
        open={open}
        reactions={reactions ?? [
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