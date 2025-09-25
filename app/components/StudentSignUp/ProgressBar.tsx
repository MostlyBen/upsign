export default function ProgressBar({ percent }: { percent: number }) {
  return (
    <>
      {percent > 0 && <progress
        className="progress progress-primary signup-progress"
        value={percent}
        style={{ borderRadius: "0 !important" }}
        max="1"
      />}
    </>
  )
}
