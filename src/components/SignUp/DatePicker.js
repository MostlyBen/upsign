import { useEffect } from "react"
import M from "materialize-css"

const DatePicker = ({ selectedDate, setSelectedDate, events }) => {
  useEffect(() => {
    const datepicker = document.querySelector('.datepicker')
    M.Datepicker.init(datepicker, {
      format: 'mmm dd, yyyy',
      autoClose: true,
      disableWeekends: true,
      defaultDate: selectedDate,
      setDefaultDate: true,
      // events: events,
      onSelect: setSelectedDate,
    })
  })

  return (
    <input type="text" className="datepicker btn white" />
  )
}

export default DatePicker