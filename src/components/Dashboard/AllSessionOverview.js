import { Link, Redirect } from "react-router-dom"

const SessionSelector = ({selected}) => {
  const hours = ['1', '2', '3', '4', '5', '6', '7']
  const activeSelection = selected ?? '1'

  return (
    <div style={{ width: "100%" }}>
      <ul className="pagination" style={{ marginTop: "0", marginBottom: "0" }}>

        {hours.map(hour => {
          return (
            <li
              className={ hour === activeSelection ? "active teal lighten-2" : "waves-effect" }
              key={`${hour}-selector`}
              style={{ width: "100%", height: "3rem", padding: "0.445rem 0" }}
            >
              <Link to={`/overview/${hour}`} style={{fontSize: "2rem", width: "100%"}}>{ hour }</Link>
            </li>
          )
        })}

      </ul>
    </div>
  )
}


const AllSessionOverview = (props) => {

  if (!props.match.params.session) {
    return <Redirect to="/overview/1" />
  }

  return (
    <div>
      <div style={{ marginTop: "3rem" }}>
        <h3 style={{ margin: "0 0 1rem 0", letterSpacing: "1px" }}>Session </h3>
        <SessionSelector
          selected={props.match.params.session}
        />
      </div>

      <hr style={{ margin: "1.445rem 0" }} />

      <div>
        Session {props.match.params.session} Overview
      </div>
    </div>
  )
}

export default AllSessionOverview