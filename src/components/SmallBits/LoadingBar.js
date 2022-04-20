const LoadingBar = () => {
  return (
    <div className="progress grey lighten-5" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
    }}>
        <div className="indeterminate grey lighten-3"></div>
    </div>
  )
}

export default LoadingBar