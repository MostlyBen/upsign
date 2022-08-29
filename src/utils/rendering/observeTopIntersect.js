import buildThresholdList from "../data/buildThresholdList";

const observeTopIntersect = () => {
  const thresholdList = buildThresholdList()
  const el = document.querySelector(".sticky-container")
  const observer = new IntersectionObserver( 
    ([e]) => {
      const boundTop = e.boundingClientRect.top
      const intersectionTop = e.intersectionRect.top

      e.target.classList.toggle("is-pinned", boundTop < intersectionTop)
    },
    { threshold: thresholdList }
  );
  
  if (el) {
    observer.observe(el);
  }
}

export default observeTopIntersect