import { useEffect } from "react"
import M from "materialize-css"

const DatePicker = ({ selectedDate, handleSelectDate, events }) => {
  useEffect(() => {
    // Search to see if the modal already has been initialized
    const datepickerModal = document.querySelector('.datepicker-modal')
    // Initialize the datepicker if the modal doesn't exist
    if (!datepickerModal) {
      const datepicker = document.querySelector('.datepicker')
      M.Datepicker.init(datepicker, {
        format: 'mmm dd, yyyy',
        autoClose: true,
        disableWeekends: true,
        defaultDate: selectedDate,
        setDefaultDate: true,
        // events: events,
        onSelect: handleSelectDate,
      })
    }

  }, [selectedDate, handleSelectDate])

  return (
    <input className="datepicker btn white" />
  )
}

export default DatePicker