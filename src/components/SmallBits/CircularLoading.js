const CircularLoading = () => { 
  return (
    <div className="preloader-wrapper active" style={{marginLeft: "1rem", position: "relative", top: "0.75rem"}}>
      <div className="spinner-layer spinner-grey-only">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
  )
}

export default CircularLoading