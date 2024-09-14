import EmojiPicker from 'emoji-picker-react';

type EmojiSelectProps = {
  open: boolean | undefined,
  onSubmit: (arg0: string) => void,
  reactions?: string[] | undefined,
  reactionsOpen?: boolean,
  onClose?: () => void,
}

const EmojiSelect = ({
  open,
  onSubmit,
  reactions,
  reactionsOpen = true,
  onClose,
}: EmojiSelectProps) => {

  const handleClickEmoji = (e: { unified: string }) => {
    onSubmit(e.unified);
    if (typeof onClose === "function") {
      onClose();
    }
  }

  return (
    <div
      className="absolute"
      onMouseLeave={() => {
        if (typeof onClose === "function") {
          onClose();
        }
      }}
    >
      <EmojiPicker
        onReactionClick={handleClickEmoji}
        onEmojiClick={handleClickEmoji}
        reactionsDefaultOpen={(Array.isArray(reactions) && !reactions.length) ? false : reactionsOpen}
        skinTonesDisabled
        lazyLoadEmojis
        emojiStyle="apple"
        theme="auto"
        previewConfig={{ showPreview: false }}
        open={open}
        reactions={reactions ?? [
          "1f389", // 🎉
          "1f90f", // 🤏
          "1f345", // 🍅
          "1f634", // 😴
        ]}
      />
    </div>
  )
}

export default EmojiSelect

