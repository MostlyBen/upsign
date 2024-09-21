import { Navigate, Outlet, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { useEffect, useState } from "react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { Attendance, RootContext, UpsignUser } from "~/types";
import { TeacherLayout } from "~/layouts";
import { AttendanceFilter } from "~/components";
import { getAllStudents, getDefaultDay, getGroupOptions, getNumberSessions } from "~/services";
import { getDateString } from "~/utils";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return params;
}

const HourSelectBtn = ({
  hour, value, onClick
}: {
  hour: number,
  value: number,
  onClick: (arg0: number) => void,
}) => {

  return (
    <input
      className="join-item btn grow checked:bg-primary checked:border-primary text-lg shadow-none"
      onClick={() => onClick(value)}
      type="radio"
      name="hour"
      aria-label={String(value)}
      defaultChecked={hour === value}
    />
  )
}

const renderHourBtns = (num: number, hour: number, onClick: (arg0: number) => void) => {
  const btnArr = [];
  for (let i = 1; i <= num; i++) {
    btnArr.push(<HourSelectBtn key={`hour-${i}`} value={i} hour={hour} onClick={onClick} />);
  }
  return btnArr;
}

const Overview = () => {
  const { db, user, userType } = useOutletContext() as RootContext;
  if (userType === "student") { return <Navigate to="/" /> }
  const navigate = useNavigate();

  if (!useLoaderData<typeof loader>().hour) {
    return (<Navigate to="/overview/1" />);
  }

  const [numberHours, setNumberHours] = useState<number>(7);
  const [selectedDateString, setSelectedDateString] = useState<string | null>();
  const [selectedDate, setSelectedDate] = useState<Date | null>();
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [groupFilter, setGroupFilter] = useState<string>("");
  const [allStudents, setAllStudents] = useState<Record<string, UpsignUser>>({});
  const [attendanceFilter, setAttendanceFilter] = useState<Attendance[]>([]);
  const [hour, setHour] = useState<number>(Number(useLoaderData<typeof loader>().hour));

  useEffect(() => {
    const fetchGroupOptions = async () => {
      const _options = await getGroupOptions(db, user?.uid);
      setGroupOptions(_options);
    }
    const fetchDefaultDay = async () => {
      const _day = await getDefaultDay(db) as Date;
      setSelectedDateString(getDateString(_day));
    }
    const fetchStudents = async () => {
      const _students = await getAllStudents(db, true);
      setAllStudents(_students as Record<string, UpsignUser>);
    }

    fetchGroupOptions();
    fetchDefaultDay();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (!selectedDateString) { return }
    const dateArray = selectedDateString.split("-");
    const _selectedDate = new Date(
      Number(dateArray[0]),
      Number(parseInt(dateArray[1], 10)) - 1,
      Number(dateArray[2]))
    setSelectedDate(_selectedDate);

  }, [selectedDateString]);

  useEffect(() => {
    const fetchNumberHours = async () => {
      if (!selectedDate) { return }
      // Getting the date is a pain, but this accounts for timezone
      const _numberHours = await getNumberSessions(db, selectedDate);

      setNumberHours(_numberHours);
    }

    fetchNumberHours();
  }, [selectedDate]);

  const handleHourClick = (hour: number) => {
    navigate(`/overview/${hour}`);
    setHour(hour);
  }


  return (
    <TeacherLayout>
      <div>
        <div className="prose mb-4">
          <h1>Session {hour}</h1>
        </div>

        <div className="join w-full flex flex-row justify-center">
          {renderHourBtns(numberHours, hour, handleHourClick)}
        </div>

        <div className="flex flex-row gap-4 w-full">
          <select
            id="group-select-overview"
            className="select bg-base-200 group-dropdown my-2 grow w-full shadow-none"
            onChange={(e) => setGroupFilter(e.target.value)}
            value={groupFilter}
          >
            <option value="">All Students</option>
            {groupOptions.map((option) => {
              return (
                <option
                  value={option}
                  key={`group-options-${option}-${Math.floor(Math.random() * 10000)}`}
                >{option}</option>
              )
            })}
          </select>

          <input
            className="input grow my-2 p-1 bg-base-200 rounded-lg ghost w-full"
            type="date"
            value={selectedDateString ?? ""}
            onChange={(e) => setSelectedDateString(e.target.value)}
          />

        </div>

        <AttendanceFilter onChange={setAttendanceFilter} />

        <div className="relative">
          {selectedDate && <Outlet
            context={{
              db,
              selectedDate,
              groupFilter,
              groupOptions,
              allStudents,
              attendanceFilter,
            }}
          />}
        </div>
      </div>
    </TeacherLayout>
  )
}

export default Overview;

